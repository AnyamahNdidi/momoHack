"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const marchantController_1 = require("../controller/marchantController");
router.route("/register-marchant").post(marchantController_1.createMarchant);
router.route("/login-marchant").post(marchantController_1.loginMarchant);
router.route("/single-marchat/:id").get(marchantController_1.singleMarchant);
router.route("/all-marchant-by-agent/:id").get(marchantController_1.allMarchant);
exports.default = router;
