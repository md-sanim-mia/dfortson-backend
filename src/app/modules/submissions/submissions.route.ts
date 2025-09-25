
import express from 'express'
import { submissionsContllors } from './submissions.contllor'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import multer from 'multer'

const route=express.Router()
// Simple multer setup for single audio
const storage = multer.diskStorage({
  destination: 'uploads/audio/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const audioUpload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files!') as unknown as null, false)
    }
  }
})

// Single audio upload
// route.post(
//   "/upload-audio/:assessmentId",
//   auth(UserRole.SUPER_ADMIN, UserRole.USER),
//   audioUpload.single('audioFile'), // Single file
//   submissionsContllors.createSubmissions
// )
route.get("/my-submissions",auth(UserRole.USER,UserRole.SUPER_ADMIN,UserRole.ADMIN),submissionsContllors.getMyAllSubmissions)
route.get("/",auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),submissionsContllors.getAllSubmissions)
route.get("/:id",auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),submissionsContllors.getSingleSubmission)



export const submissionsRoute=route