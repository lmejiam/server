import{
        getCounts,
        getStatus,
        getRemoteConnectionStatus
}from "../controllers/status.controller.js"

import {Router} from "express"

const router_status = Router()

router_status.route("/user/status")
        .get(getStatus)

router_status.route("/user/counts")
        .get(getCounts)

router_status.route("/user/ping")
        .get(getRemoteConnectionStatus)

export default router_status;