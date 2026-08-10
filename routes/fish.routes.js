import{
    getFish
}from "../controllers/fish.controller.js"

import {Router} from "express"

const router_fish = Router()

router_fish.route("/user/fish")
        .get(getFish)


export default router_fish;