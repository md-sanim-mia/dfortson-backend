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
  const upload = { imageUrl: file.path, originalname: file.originalname, filename: file.filename ,fileSize: file.size, mimetype: file.mimetype};
  console.log(upload)
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
    const file = req.file;
 
  // if (!file) {
  //   throw new Error("Image file is required");
  // }
  const upload = { imageUrl: file?.path, originalname: file?.originalname, filename: file?.filename ,fileSize: file?.size, mimetype: file?.mimetype};
  console.log(upload)
  const result = await UploadService.updateUploadIntoDB(id, upload, user);
  
  sendResponse(res, {
    statusCode: status.OK,
    message: "Upload updated successfully",
    data: result,
  });
});
const createUploadsIntoDB=catchAsync(async (req, res) => {
    const {id}=req.user as JwtPayload;  
 const { images } = req.files as any;
  if (!images) {
    throw new Error("Image file is required");
  }     
  const uploads = images.map((file: any) => ({
    imageUrl: file.path,
    originalname: file.originalname,
    filename: file.filename,
    fileSize: file.size,
    mimetype: file.mimetype,
  }));
  console.log(uploads)
  const result = await UploadService.createUploadsIntoDB(uploads,id );      
  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Images uploaded successfully',
    data: result,
  });
}
);

const deleteMultipleFiles = catchAsync(async (req, res) => {
    
    const { ids } = req.body;
  
  const result = await Promise.all(
    ids.map((id: string) => UploadService.deleteMultipleFiles([id], req.user as JwtPayload))
  );      
  sendResponse(res, {
    statusCode: status.OK,
    message: 'Images deleted successfully', 
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
  getAllMyUploads,
  createUploadsIntoDB,
  deleteMultipleFiles
};