import express from "express"
const router = express.Router()

import { fundUserWalltent,fundMerchantWalltent,getagentHistory,getmerchantHistory  } from "../controller/fundWallet"


router.route("/fund-wallet-agent/:id").post(fundUserWalltent)
router.route("/fund-wallet-merchant/:id").post(fundMerchantWalltent)


router.route("/history-wallet-agnet/:id").get(getagentHistory)
router.route("/history-wallet-merchant/:id").get(getmerchantHistory)





export default router;