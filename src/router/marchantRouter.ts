import express from "express"
const router = express.Router()

import { createMarchant,loginMarchant,singleMarchant,allMarchant } from "../controller/marchantController"


router.route("/register-marchant").post(createMarchant)
router.route("/login-marchant").post(loginMarchant)
router.route("/single-marchat/:id").get(singleMarchant)
router.route("/all-marchant-by-agent/:id").get(allMarchant)

export default router;