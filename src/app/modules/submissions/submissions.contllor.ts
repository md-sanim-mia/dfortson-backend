import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { submissionsServices } from "./submissions.service";

// const createSubmissions=catchAsync(async(req,res)=>{
//     const {id}=req.user as JwtPayload
//     const {assessmentId}=req.params
//  if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Audio file is required"
//       })
//     }
    
//     const audioFile = req.file // Single file object
//     const audioPath = audioFile.path
    
//     console.log('Audio uploaded:', audioPath)
    
//     const result= await submissionsServices.createSubmissions(id,assessmentId,audioFile)
//   sendResponse(res, {
//     statusCode: 200,
//     message: "assessment deleted successfully",
//     data: result,
//   });
// })
// Get All Submissions
const getAllSubmissions = catchAsync(async (req, res) => {
  const result = await submissionsServices.getAllSubmissions();

  sendResponse(res, {
    statusCode: 200,
    message: "Submissions retrieved successfully",
    data: result,
  });
});
const getMyAllSubmissions = catchAsync(async (req, res) => {

  const {id}=req.user as JwtPayload 
  const result = await submissionsServices.getMySubmission(id);

  sendResponse(res, {
    statusCode: 200,
    message: "My submissions retrieved successfully",
    data: result,
  });
});

// Get Single Submission
const getSingleSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await submissionsServices.getSingleSubmission(id);

  sendResponse(res, {
    statusCode: 200,
    message: "Submission retrieved successfully",
    data: result,
  });
});

// Update Submission
// const updateSubmission = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "Audio file is required",
//     });
//   }

//   const audioFile = req.file;
//   const result = await submissionsServices.updateSubmission(id, audioFile);

//   sendResponse(res, {
//     statusCode: 200,
//     message: "Submission updated successfully",
//     data: result,
//   });
// });

// Delete Submission
const deleteSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await submissionsServices.deleteSubmission(id);

  sendResponse(res, {
    statusCode: 200,
    message: "Submission deleted successfully",
    data: result,
  });
});




export const submissionsContllors={

getAllSubmissions,
getSingleSubmission,
deleteSubmission,
getMyAllSubmissions
}

