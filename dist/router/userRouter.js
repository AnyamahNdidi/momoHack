"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
router.route("/register-agent").post(userController_1.createUserAgent);
router.route("/login-agent").post(userController_1.loginAgent);
router.route("/single-agent/:id").get(userController_1.singleAgent);
exports.default = router;
