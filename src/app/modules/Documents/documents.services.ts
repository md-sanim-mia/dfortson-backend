import prisma from "../../utils/prisma";

const createDocument = async (file:any) => {
    // Logic to create a document
   const result=await prisma.documentPdf.create({
       data: {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fileUrl: file.path,      // Cloudinary URL
    size: file.size,
    filename: file.filename,
  },
    });
    return result;
}

const getAllDocuments = async () => {
    // Logic to get all documents

    const result = await prisma.documentPdf.findMany();
    return result;
}   

const getSingleDocument = async (id: string) => {
    // Logic to get a single document by ID
    if (!id) {
        throw new Error("Document ID is required");
    }   

    const result = await prisma.documentPdf.findUnique({
        where: { id },
    });
    return result;
} 

const deleteDocument = async (id: string) => {
    // Logic to delete a document by ID
    if (!id) {
        throw new Error("Document ID is required");
    }
    const result = await prisma.documentPdf.delete({
        where: { id },
    });
    return result;
}
const  updateDocument = async (id: string, files: any) => {
    // Logic to update a document by ID
    if (!id) {
        throw new Error("Document ID is required");
    }


    const result = await prisma.documentPdf.update({
        where: { id },
        data: { ...files },
    });
    return result;
}

export const DocumentService = {
    createDocument,
    getAllDocuments,
    getSingleDocument,
    updateDocument,
    deleteDocument,
};          