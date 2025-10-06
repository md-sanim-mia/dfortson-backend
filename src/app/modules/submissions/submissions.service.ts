import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

// const createSubmissions = async (
//   userId: string,
//   assessmentId: string,
//   payload: any
// ) => {

//   const result = await prisma.submission.create({
//     data: { userId, scenarioId: assessmentId, audioFile:payload },
//   });
//   return result;
// };

// Get All Submissions
const getAllSubmissions = async () => {
  const result = await prisma.submission.findMany({
    include: {
      user: true, // related user info যদি লাগে
      scenario: true, // related assessment info যদি লাগে
      humanFeedback :true
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
      scenario: {select:{  id: true,
      description: true,
      title: true,
      scenario: true,
      markingPointer: true,
      additionalDocument: true,
      createdAt: true,
      updatedAt: true,}},
        humanFeedback:true,
    },
  });
  return result;
};

const getMySubmission = async (userId: string) => {

  if(!userId){
    throw new  AppError(status.BAD_REQUEST,"user id is not found !")
  }
  const result = await prisma.submission.findMany({
    where: { userId},
    include: {
      user: {select:{
        fullName:true,email:true,id:true
      }},
      scenario: {select:{  id: true,
      description: true,
      title: true,
      scenario: true,
      markingPointer: true,
      additionalDocument: true,
      createdAt: true,
      updatedAt: true,}},
      humanFeedback:true,
    },
  });
  return result;
};

const getSingleStudentSubmission = async (userId: string) => {

  if(!userId){
    throw new  AppError(status.BAD_REQUEST,"user id is not found !")
  }
  const result = await prisma.submission.findMany({
    where: { userId},
    include: {
      user:{select:{
        fullName:true,email:true,id:true
      }},
      scenario: {select:{  id: true,
      description: true,
      title: true,
      scenario: true,
      markingPointer: true,
      additionalDocument: true,
      createdAt: true,
      updatedAt: true,}},
      humanFeedback:true,
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
 
  getAllSubmissions,
  getSingleSubmission,
  updateSubmission,
  deleteSubmission,
  getMySubmission,
  getSingleStudentSubmission 
};
