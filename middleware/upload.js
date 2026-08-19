import multer from "multer";
import os from "os";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const TAGS_DIR = path.join(os.homedir(),  process.env.TAGS_UPLOAD_PATH);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TAGS_DIR);
    },
    filename: (req, file, cb) => {
        //const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, file.originalname);
    },
});

// optional: restrict file types server-side too (don't just trust the frontend)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".txt", ".ini", ".config", ".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};
//test
const upload = multer({ storage, fileFilter });

export default upload;