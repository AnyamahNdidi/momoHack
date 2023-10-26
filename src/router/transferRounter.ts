import express from "express"
const router = express.Router()

import { agentToAnotherWalet } from "../controller/TransferFund"


router.route("/send-fund/:senderId").post(agentToAnotherWalet)
// router.route("/fund-wallet-merchant/:id").post(fundMerchantWalltent)


// router.route("/history-wallet-agnet/:id").get(getagentHistory)
// router.route("/history-wallet-merchant/:id").get(getmerchantHistory)





export default router;