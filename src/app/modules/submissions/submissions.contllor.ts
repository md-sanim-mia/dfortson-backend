import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { submissionsServices } from "./submissions.service";

import PDFDocument from'pdfkit'
import fs from'fs'
import path from 'path'
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

const getSingleStundentSubmissions = catchAsync(async (req, res) => {

  const {id}=req.params
  console.log(id)
  const result = await submissionsServices.getSingleStudentSubmission(id);

  sendResponse(res, {
    statusCode: 200,
    message: "single student submissions retrieved successfully",
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

const downloadSingleSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await submissionsServices.getSingleSubmission(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      message: "Submission not found",
    });
  }

  const doc = new PDFDocument({ margin: 50 });
  const fileName = 'download-submission.pdf';
  const tempDir = path.join(__dirname, '../temp');
  const filePath = path.join(tempDir, fileName);

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // PDF Title
  doc.fontSize(18).fillColor('black').text('Submission Report', { align: 'center' });
  doc.moveDown(1.5);

  // Submission Basic Info
  doc.fontSize(12).fillColor('black').text(`Submission ID: ${id}`);
  doc.text(`Status: ${result.status}`);
  doc.text(`Created At: ${new Date(result.createdAt).toLocaleString()}`);
  doc.text(`Updated At: ${new Date(result.updatedAt).toLocaleString()}`);
  doc.moveDown();

  // Evaluation Summary
  doc.fontSize(14).fillColor('black').text('Evaluation Summary', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Total Score: ${result.totalScore}`);
  doc.moveDown();

  // Positive Feedback
  doc.fontSize(13).fillColor('black').text('✅ Positive Feedback', { underline: true });
  if (result.positive && result.positive.trim() !== '') {
    doc.fontSize(11).fillColor('black').text(result.positive);
  } else {
    doc.fontSize(11).fillColor('gray').text('No positive feedback.');
  }
  doc.moveDown();

  // Negative Feedback (bullet points)
  doc.fontSize(13).fillColor('black').text('❌ Negative Feedback', { underline: true });
  if (result.negative && result.negative.trim() !== '') {
    const negativePoints = result.negative.split('\n').filter(line => line.trim() !== '');
    negativePoints.forEach(point => {
      doc.fontSize(11).fillColor('black').text(`• ${point}`);
    });
  } else {
    doc.fontSize(11).fillColor('gray').text('No negative feedback.');
  }
  doc.moveDown();

  // Suggested Improvements (bullet points)
  doc.fontSize(13).fillColor('black').text('🛠️ Suggested Improvements', { underline: true });
  if (result.improvement && result.improvement.trim() !== '') {
    const improvementPoints = result.improvement.split('\n').filter(line => line.trim() !== '');
    improvementPoints.forEach(point => {
      doc.fontSize(11).fillColor('black').text(`• ${point}`);
    });
  } else {
    doc.fontSize(11).fillColor('gray').text('No suggestions provided.');
  }
  doc.moveDown();

  doc.end();

  // Send as downloadable file
  writeStream.on('finish', () => {
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
        return sendResponse(res, {
          statusCode: 500,
          message: "Error downloading file",
        });
      }

      // Delete the temporary file
      fs.unlinkSync(filePath);
    });
  });
});

export const submissionsContllors={
getAllSubmissions,
getSingleSubmission,
deleteSubmission,
getMyAllSubmissions,
downloadSingleSubmission,
getSingleStundentSubmissions
}

