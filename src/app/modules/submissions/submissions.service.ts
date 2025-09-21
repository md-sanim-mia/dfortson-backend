import prisma from "../../utils/prisma";

const createSubmissions = async (
  userId: string,
  assessmentId: string,
  payload: any
) => {
  const result = await prisma.submission.create({
    data: { userId, scenarioId: assessmentId, ...payload },
  });
  return result;
};

// Get All Submissions
const getAllSubmissions = async () => {
  const result = await prisma.submission.findMany({
    include: {
      user: true, // related user info যদি লাগে
      scenario: true, // related assessment info যদি লাগে
    },
  });
  return result;
};

// Get Single Submission
const getSingleSubmission = async (id: string) => {
  const result = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      scenario: true,
    },
  });
  return result;
};

// Update Submission
const updateSubmission = async (id: string, payload: any) => {
  const result = await prisma.submission.update({
    where: { id },
    data: { ...payload },
  });
  return result;
};

// Delete Submission
const deleteSubmission = async (id: string) => {
  const result = await prisma.submission.delete({
    where: { id },
  });
  return result;
};

export const submissionsServices = {
  createSubmissions,
  getAllSubmissions,
  getSingleSubmission,
  updateSubmission,
  deleteSubmission,
};
