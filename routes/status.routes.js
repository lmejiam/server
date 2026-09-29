import{
    getStatus
}from "../controllers/status.controller.js"

import {Router} from "express"

const router_fish = Router()

router_fish.route("/user/status")
        .get(getStatus)


export default router_status;