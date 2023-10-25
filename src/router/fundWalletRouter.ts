import express from "express"
const router = express.Router()

import { fundUserWalltent,fundMerchantUserWalltent } from "../controller/fundWallet"


router.route("/fund-wallet-agent/:id").post(fundUserWalltent)
router.route("/fund-wallet-merchant/:id").post(fundMerchantUserWalltent)



export default router;