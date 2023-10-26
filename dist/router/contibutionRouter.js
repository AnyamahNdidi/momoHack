"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const contibutorController_1 = require("../controller/contibutorController");
router.route("/create-contribution/:agentId/:marchantId").post(contibutorController_1.createContribution);
// router.route("/fund-wallet-merchant/:id").post(fundMerchantWalltent)
// router.route("/history-wallet-agnet/:id").get(getagentHistory)
// router.route("/history-wallet-merchant/:id").get(getmerchantHistory)
exports.default = router;
