"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const fundWallet_1 = require("../controller/fundWallet");
router.route("/fund-wallet-agent/:id").post(fundWallet_1.fundUserWalltent);
router.route("/fund-wallet-merchant/:id").post(fundWallet_1.fundMerchantWalltent);
router.route("/history-wallet-agnet/:id").get(fundWallet_1.getagentHistory);
router.route("/history-wallet-merchant/:id").get(fundWallet_1.getmerchantHistory);
exports.default = router;
