import{
    getCounts,
    getStatus
}from "../controllers/status.controller.js"

import {Router} from "express"

const router_status = Router()

router_status.route("/user/status")
        .get(getStatus)

router_status.route("/user/counts")
        .get(getCounts)

export default router_status;