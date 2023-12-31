"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historySchema = new mongoose_1.default.Schema({
    message: {
        type: String,
    },
    RefrenceId: {
        type: String,
    },
    recipients: {
        type: String,
    },
    status: {
        type: String,
    },
    transactionType: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    decs: {
        type: String,
    },
    amount: {
        type: Number,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("historys", historySchema);
