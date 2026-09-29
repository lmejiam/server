import{
    getStatus
}from "../controllers/status.controller.js"

import {Router} from "express"

const router_status = Router()

router_status.route("/user/status")
        .get(getStatus)


export default router_status;