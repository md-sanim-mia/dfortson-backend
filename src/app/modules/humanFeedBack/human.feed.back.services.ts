import prisma from "../../utils/prisma";

// Create Human Feedback
const createHumanFeedback = async (
  submissionId: string,
  comments: string
) => {
  const result = await prisma.humanFeedback.create({
    data: { submissionId, comments },
    include: { submission: true }, // related submission info চাইলে
  });
  return result;
};

// Get All Human Feedbacks
const getAllHumanFeedbacks = async () => {
  const result = await prisma.humanFeedback.findMany({
    include: { submission: true }, // related submission info চাইলে
  });
  return result;
};

// Get Single Human Feedback
const getSingleHumanFeedback = async (id: string) => {
  const result = await prisma.humanFeedback.findUnique({
    where: { id },
    include: { submission: true },
  });
  return result;
};


// Update Human Feedback
const updateHumanFeedback = async (id: string, payload: any) => {
  const result = await prisma.humanFeedback.update({
    where: { id },
    data: { ...payload },
  });
  return result;
};

// Delete Human Feedback
const deleteHumanFeedback = async (id: string) => {
  const result = await prisma.humanFeedback.delete({
    where: { id },
  });
  return result;
};

export const humanFeedbackServices = {
  createHumanFeedback,
  getAllHumanFeedbacks,
  getSingleHumanFeedback,
  updateHumanFeedback,
  deleteHumanFeedback,
};
