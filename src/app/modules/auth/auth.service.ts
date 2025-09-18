import status from "http-status";
import config from "../../config";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/AppError";
import { RefreshPayload } from "./auth.interface";
import { sendEmail } from "../../utils/sendEmail";
import { jwtHelpers } from "./../../helpers/jwtHelpers";
import { passwordCompare } from "../../helpers/comparePasswords";
import { hashPassword } from "../../helpers/hashPassword";
import bcrypt from "bcrypt";
const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatched = await passwordCompare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, "Password is incorrect!");
  }

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.role,
    isVerified: user.isVerified,
  };

  // Check if user is not active
  if (!user.isVerified) {
    const accessToken = jwtHelpers.createToken(
      jwtPayload,
      config.jwt.access.secret as string,
      config.jwt.resetPassword.expiresIn as string
    );

    const confirmedLink = `${config.verify.email}?token=${accessToken}`;

    await sendEmail(user.email, undefined, confirmedLink);

    throw new ApiError(
      status.UNAUTHORIZED,
      "User is not verified! We have sent a confirmation email to your email address. Please check your inbox."
    );
  }

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (token: string) => {
  const verifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.access.secret as string
  );

  const user = await prisma.user.findUnique({
    where: { email: verifiedToken.email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (user.isVerified) {
    throw new ApiError(status.BAD_REQUEST, "User already verified!");
  }

  await prisma.user.update({
    where: {
      email: verifiedToken.email,
    },
    data: {
      isVerified: true,
    },
  });

  return null;
};

const verifyResetPassLink = async (token: string) => {
  const verifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.access.secret as string
  );

  const user = await prisma.user.findUnique({
    where: { email: verifiedToken.email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  await prisma.user.update({
    where: { email: verifiedToken.email },
    data: {
      isResetPassword: false,
      canResetPassword: true,
    },
  });

  return null;
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!newPassword) {
    throw new ApiError(status.BAD_REQUEST, "New password is required!");
  }

  if (!confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, "Confirm password is required!");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "New password and confirm password do not match!"
    );
  }

  const isPasswordMatch = await passwordCompare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(status.UNAUTHORIZED, "Current password is incorrect!");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    },
  });

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.isVerified) {
    throw new ApiError(status.UNAUTHORIZED, "User account is not verified!");
  }


  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Save OTP in DBinit 
  await prisma.user.update({
    where: { email },
    data: {
      isResetPassword: true,
      canResetPassword: false,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiresAt: otpExpiresAt,
    },
  });

  // Send OTP via email
 const emailContent = `
  <h2>Password Reset Request</h2>
  <p>Hello ${user.fullName},</p>
  <p>We received a request to reset your password. Please use the following OTP to proceed:</p>

  <div style="
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
    margin: 20px auto;
    max-width: 400px;
    width: 100%;
    border-radius: 8px;
  ">
    <h1 style="
      color: #333;
      font-size: 32px;
      letter-spacing: 5px;
      margin: 0;
    ">
      ${otp}
    </h1>
  </div>

  <p>This OTP will expire in 10 minutes.</p>
  <p>If you didn't request this password reset, please ignore this email.</p>
  <p>Best regards,<br>Your App Team</p>
`;
  await sendEmail(user.email, "Password Reset OTP", emailContent);

  return {
    message: "We have sent a 6-digit OTP to your email address. Please check your inbox and use the OTP to reset your password.",
  };
};

const verifyResetPasswordOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ 
    where: { email } 
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.isResetPassword) {
    throw new ApiError(status.BAD_REQUEST, "No password reset request found!");
  }

  if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
    throw new ApiError(status.BAD_REQUEST, "Invalid OTP!");
  }

  if (!user.resetPasswordOTPExpiresAt || new Date() > user.resetPasswordOTPExpiresAt) {
    throw new ApiError(status.BAD_REQUEST, "OTP has expired!");
  }

  // Mark that user can now reset password and clear OTP
  await prisma.user.update({
    where: { email },
    data: {
      canResetPassword: true,
      resetPasswordOTP: null,
      resetPasswordOTPExpiresAt: null,
    },
  });

  return {
    message: "OTP verified successfully. You can now reset your password.",
  };
};
const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, "Passwords do not match!");
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.canResetPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "User is not eligible for password reset!"
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email: email },
    data: {
      password: hashedPassword,
      isResetPassword: false,
      canResetPassword: false,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};

const resendVerificationLink = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (user.isVerified) {
    throw new ApiError(status.BAD_REQUEST, "User account already verified!");
  }

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.role,
    isVerified: user.isVerified,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const confirmedLink = `${config.verify.email}?token=${accessToken}`;

  await sendEmail(user.email, undefined, confirmedLink);

  return {
    message:
      "New verification link has been sent to your email. Please check your inbox.",
  };
};

const resendResetPassLink = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }
 if (!user.canResetPassword) {
    throw new ApiError(status.UNAUTHORIZED, "Please verify OTP first!");
  } // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password and clear reset flags
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      isResetPassword: false,
      canResetPassword: false,
    },
  });

  // Send confirmation email
  const confirmationEmailContent = `
    <h2>Password Reset Successful</h2>
    <p>Hello ${user.fullName},</p>
    <p>Your password has been successfully reset for your account associated with ${email}.</p>
    <p><strong>Reset Time:</strong> ${new Date().toLocaleString()}</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
    <p>Best regards,<br>Your App Team</p>
  `;

  await sendEmail(user.email, "Password Reset Confirmation", confirmationEmailContent);

  return {
    message: "Password has been reset successfully! A confirmation email has been sent.",
  };
};

const getMe = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePic: true,
      role: true,
      isVerified: true,
      isSubscribed: true,
      planExpiration: true,
    },
  });

  return result;
};

export const refreshToken = async (token: string) => {
  const decoded = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh.secret as string
  ) as RefreshPayload;

  const { email, iat } = decoded;
  console.log(email)

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePic: true,
      isVerified: true,
      passwordChangedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  /* Reject if password changed after token was issued */
  if (
    user.passwordChangedAt &&
    /* convert both to seconds since epoch */
    Math.floor(user.passwordChangedAt.getTime() / 1000) > iat
  ) {
    throw new ApiError(
      status.UNAUTHORIZED,
      "Password was changed after this token was issued"
    );
  }

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profilePic: user?.profilePic,
    isVerified: user.isVerified,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return { accessToken };
};


export const AuthService = {
  getMe,
  loginUser,
  verifyEmail,
  refreshToken,
  resetPassword,
  changePassword,
  forgotPassword,
  verifyResetPassLink,
  resendResetPassLink,
  resendVerificationLink,
  verifyResetPasswordOTP
};
