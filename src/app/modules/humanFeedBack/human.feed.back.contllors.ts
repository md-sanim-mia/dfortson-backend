import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { humanFeedbackServices } from "./human.feed.back.services";


// Create Human Feedback
const createHumanFeedback = catchAsync(async (req, res) => {
  const {comments } = req.body;
const {submissionId }=req.params 
  if (!submissionId || !comments) {
    return res.status(400).json({
      success: false,
      message: "submissionId and comments are required",
    });
  }

  const result = await humanFeedbackServices.createHumanFeedback(submissionId, comments);

  sendResponse(res, {
    statusCode: 200,
    message: "Human feedback created successfully",
    data: result,
  });
});

// Get All Human Feedbacks
const getAllHumanFeedbacks = catchAsync(async (req, res) => {
  const result = await humanFeedbackServices.getAllHumanFeedbacks();

  sendResponse(res, {
    statusCode: 200,
    message: "All human feedbacks retrieved successfully",
    data: result,
  });
});

// Get Single Human Feedback
const getSingleHumanFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await humanFeedbackServices.getSingleHumanFeedback(id);

  sendResponse(res, {
    statusCode: 200,
    message: "Human feedback retrieved successfully",
    data: result,
  });
});


// Update Human Feedback
const updateHumanFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;

  const result = await humanFeedbackServices.updateHumanFeedback(id, { comments });

  sendResponse(res, {
    statusCode: 200,
    message: "Human feedback updated successfully",
    data: result,
  });
});

// Delete Human Feedback
const deleteHumanFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await humanFeedbackServices.deleteHumanFeedback(id);

  sendResponse(res, {
    statusCode: 200,
    message: "Human feedback deleted successfully",
    data: result,
  });
});

export const humanFeedbackControllers = {
  createHumanFeedback,
  getAllHumanFeedbacks,
  getSingleHumanFeedback,
  updateHumanFeedback,
  deleteHumanFeedback,
};
