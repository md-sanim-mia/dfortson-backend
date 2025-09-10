import passport, { use } from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";
import prisma from "../utils/prisma";
import config from ".";
import { jwtHelpers } from "../helpers/jwtHelpers";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleAuth.clientID!,
      clientSecret: config.googleAuth.clientSecret!,
      callbackURL: config.googleAuth.callbackURL!,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
     
      try {
        // email দিয়ে check
        let user = await prisma.user.findUnique({
          where: { email: profile.emails![0].value },
        });


        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: profile.displayName,
              email: profile.emails![0].value,
              password: Math.random().toString(36).slice(-8), // dummy password
              profilePic: profile.photos?.[0].value || "",
              isVerified: true,
            },
          });
        }

        // JWT generate
        const jwtPayload = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
          isVerified: user.isVerified,
        };

        const accessToken = jwtHelpers.createToken(
          jwtPayload,
          config.jwt.access.secret!,
          config.jwt.access.expiresIn!
        );

        done(null, { accessToken });
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookAuth.clientID!,
      clientSecret: config.facebookAuth.clientSecret!,
      callbackURL: config.facebookAuth.callbackURL!,
      profileFields: ['id', 'displayName', 'photos', 'email'] // Request email permission
    },
    async (accessToken: string, refreshToken: string, profile: FacebookProfile, done) => {
   
      try {
        // Facebook sometimes doesn't provide email
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        
        let user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: profile.displayName || profile.name?.givenName + " " + profile.name?.familyName || "Facebook User",
              email: email,
              password: Math.random().toString(36).slice(-8),
              profilePic: profile.photos?.[0]?.value || "",
              isVerified: true,
            },
          });
        }
        console.log(user)

        const jwtPayload = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
          isVerified: user.isVerified,
        };

        const token = jwtHelpers.createToken(
          jwtPayload,
          config.jwt.access.secret!,
          config.jwt.access.expiresIn!
        );

        done(null, { accessToken: token });
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);
export default passport;
