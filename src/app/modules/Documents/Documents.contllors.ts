import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DocumentService } from "./documents.services";

const createDocument=catchAsync(async(req,res)=>{
    const fileUrl = req.file
    if (!fileUrl) {
        throw new Error("File is required");
    }

 console.log(req.file)

   const result = await DocumentService.createDocument(fileUrl);

    sendResponse(res, {         
        statusCode: 201,
        message: "Document created successfully",
        data: result, 
    });
});

const getAllDocuments=catchAsync(async(req,res)=>{
   const result = await DocumentService.getAllDocuments();              

    sendResponse(res, {         
        statusCode: 200,
        message: "Documents retrieved successfully",
        data: result, 
    });
}

);

const getSingleDocument=catchAsync(async(req,res)=>{
   const {id}=req.params;
   const result = await DocumentService.getSingleDocument(id);
    
    
    sendResponse(res, {         
        statusCode: 200,
        message: "Document retrieved successfully",
        data: result, 
    });
}           
);          
const updateDocument=catchAsync(async(req,res)=>{                       
    const {id}=req.params;              
     const file= req.file
    if (!file) {
        throw new Error("File is required");
    } 

    const uploadData={ originalname: file?.originalname,
    mimetype: file?.mimetype,
    fileUrl: file?.path,      // Cloudinary URL
    size: file?.size,
    filename: file?.filename}
    const result = await DocumentService.updateDocument(id,uploadData);
    sendResponse(res, {
        statusCode: 200,
        message: "Document updated successfully",
        data: result, 
    });
}           
);        
const deleteDocument=catchAsync(async(req,res)=>{   
    const {id}=req.params;                              

    const result = await DocumentService.deleteDocument(id);    
    sendResponse(res, {     
        statusCode: 200,                        
        message: "Document deleted successfully",       
        data: result,

    });
}
);
export const DocumentController = {
    createDocument,
    getAllDocuments,                
    getSingleDocument,
    updateDocument,
    deleteDocument,
};  