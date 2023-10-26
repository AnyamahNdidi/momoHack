import express from "express"
const router = express.Router()

import { createContribution } from "../controller/contibutorController"


router.route("/create-contribution/:agentId/:marchantId").post(createContribution)
// router.route("/fund-wallet-merchant/:id").post(fundMerchantWalltent)


// router.route("/history-wallet-agnet/:id").get(getagentHistory)
// router.route("/history-wallet-merchant/:id").get(getmerchantHistory)





export default router;