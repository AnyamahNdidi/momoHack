import express from "express"
const router = express.Router()

import { createUserAgent,loginAgent,singleAgent } from "../controller/userController"


router.route("/register-agent").post(createUserAgent)
router.route("/login-agent").post(loginAgent)
router.route("/single-agent/:id").get(singleAgent)


export default router;