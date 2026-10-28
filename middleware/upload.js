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
        cb(null, "activetagfile.csv");
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 }});

export default upload;