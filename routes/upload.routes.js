import {
    handleUpload
} from "../controllers/upload.controller.js"

import { Router } from "express"
import upload from "../middleware/upload.js"

const router_upload = Router()

router_upload.route("/tags/upload")
        .post(upload.array("files", 2), handleUpload)


export default router_upload;