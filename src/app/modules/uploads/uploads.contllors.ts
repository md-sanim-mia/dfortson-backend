import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { UploadService } from "./upload.service";

const createUpload = catchAsync(async (req, res) => {
    const {id}=req.user as JwtPayload

      const file = req.file;
 
  if (!file) {
    throw new Error("Image file is required");
  }
  const upload = { ...req.body, imageUrl: file.path };

  const result = await UploadService.createUploadIntoDB(upload,id );
  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Upload created successfully',
    data: result,
  });
});



const getAllUploads = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload;
  const result = await UploadService.getAllUploadsFromDB(req.query);
   sendResponse(res, {
    statusCode: status.OK,
    message: "Uploads retrieved successfully",
    data: result,
  });
});

const getAllMyUploads = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload;
  const result = await UploadService.getAllMyUploadsFromDB(user.id,req.query);
   sendResponse(res, {
    statusCode: status.OK,
    message: "my all Uploads retrieved successfully",
    data: result.result,
    meta:result.meta
  });
});



const getSingleUpload = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await UploadService.getSingleUploadFromDB(id, user);
  
  sendResponse(res, {
    statusCode: status.OK,
    message: "Upload retrieved successfully",
    data: result,
  });
});

const updateUpload = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await UploadService.updateUploadIntoDB(id, req.body, user);
  
  sendResponse(res, {
    statusCode: status.OK,
    message: "Upload updated successfully",
    data: result,
  });
});

const deleteUpload = catchAsync(async (req ,res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await UploadService.deleteUploadFromDB(id, user);
  
  sendResponse(res, {
    statusCode: status.OK,
    message: "Upload deleted successfully",
    data: result,
  });
});

export const UploadController = {
  createUpload,
  getAllUploads,
  getSingleUpload,
  updateUpload,
  deleteUpload,
  getAllMyUploads
};