import { Upload, UploadStatus, User, UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { refreshToken } from "../auth/auth.service";

export type uploadPayload={
  imageUrl: string;
  originalname: string;
  filename: string;
  fileSize: number;
  mimetype: string; 
}
const createUploadIntoDB = async (
  payload: Omit<uploadPayload, "id" | "createdAt" | "user">,
  userId: string
): Promise<Upload> => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(status.NOT_FOUND, "User not found");

  const result = await prisma.upload.create({
    data: { ...payload, userId },
  });

  console.log(result)
  return result;
};
const getAllUploadsFromDB = async (  query: Record<string, unknown>) => {
const useQuery = new QueryBuilder(prisma.upload, query)
    .include({
      user: { select: { id: true, fullName: true, email: true } },
      matches: true,
      morphVideos: true,
    });

  const [result, meta] = await Promise.all([
    useQuery.execute(),
    useQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(status.NOT_FOUND, "No uploads found!");
  }

  return { result, meta };
};
const getAllMyUploadsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  if (!userId) throw new AppError(status.NOT_FOUND, "User not found");

  const useQuery = new QueryBuilder(prisma.upload, {...query,userId})
    .include({
      user: { select: { id: true, fullName: true, email: true } },
      matches: true,
      morphVideos: true,
    });

  const [result, meta] = await Promise.all([
    useQuery.execute(),
    useQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(status.NOT_FOUND, "No uploads found!");
  }

  return { result, meta };
};

const getSingleUploadFromDB = async (
  id: string,
  user: any
): Promise<Upload | null> => {
  let whereClause: any = { id };

  // If user is not admin, only allow access to their own uploads
  if (user.role !== UserRole.ADMIN) {
    whereClause.userId = user.userId;
  }

  const result = await prisma.upload.findUnique({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      matches: {
        include: {
          celebrity: true,
        },
      },
      morphVideos: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Upload not found");
  }

  return result;
};

const updateUploadIntoDB = async (
  id: string,
  payload: Partial<uploadPayload>,
  user: any
): Promise<uploadPayload> => {
  let whereClause: any = { id };

  // If user is not admin, only allow updates to their own uploads
  if (user.role !== UserRole.ADMIN) {
    whereClause.userId = user.userId;
  }

  // Check if upload exists
  const uploadExists = await prisma.upload.findUnique({
    where: whereClause,
  });

  if (!uploadExists) {
    throw new AppError(status.NOT_FOUND, "Upload not found");
  }

  const result = await prisma.upload.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deleteUploadFromDB = async (id: string, user: any) => {
  let whereClause: any = { id };

  // If user is not admin, only allow deletion of their own uploads
  if (user.role !== UserRole.ADMIN) {
    whereClause.userId = user.userId;
  }

  // Check if upload exists
  const uploadExists = await prisma.upload.findUnique({
    where: whereClause,
  });

  if (!uploadExists) {
    throw new AppError(status.NOT_FOUND, "Upload not found");
  }

  // Delete related matches and morph videos first
  await prisma.match.deleteMany({
    where: { uploadId: id },
  });

  await prisma.morphVideo.deleteMany({
    where: { uploadId: id },
  });

  const result = await prisma.upload.delete({
    where: { id },
  });

  return result;
};

const createUploadsIntoDB = async (
  payloads: Omit<uploadPayload, "id" | "createdAt" | "user">[],
  userId: string
): Promise<Upload[]> => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(status.NOT_FOUND, "User not found");

  const results = await Promise.all(
    payloads.map((item) =>
      prisma.upload.create({
        data: { ...item, userId },
      })
    )
  );

  console.log(results);
  return results; // সব newly created uploads এর data array আকারে আসবে
};

const deleteMultipleFiles = async (ids: string[], user: any) => {
  if (!ids || ids.length === 0) {
    throw new AppError(status.BAD_REQUEST, "No IDs provided for deletion");
  }
  const results = await Promise.all(
    ids.map((id) => deleteUploadFromDB(id, user))
  );
  return results;
};  

export const UploadService = {
  createUploadIntoDB,
  getAllUploadsFromDB,
  getSingleUploadFromDB,
  updateUploadIntoDB,
  deleteUploadFromDB,
  getAllMyUploadsFromDB,
  createUploadsIntoDB,
  deleteMultipleFiles
};
