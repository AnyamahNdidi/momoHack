"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    state: {
        type: String,
    },
    LGA: {
        type: String,
    },
    Area: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "agents"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("profiles", profileSchema);
