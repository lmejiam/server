import {
    getImages
} from "../controllers/images.controller.js"

import { Router } from "express"

const router_images = Router()

router_images.route("/user/images")
        .get(getImages)

export default router_images;
