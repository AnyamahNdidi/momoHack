"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ajoSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    agentIncharge: {
        type: String,
    },
    fixedAmount: {
        type: Number,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "marchants"
    },
    agent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "agents"
    },
    ownerName: {
        type: String,
    },
    // amount: {
    //   type: Number,
    // }
}, { timestamps: true });
exports.default = mongoose_1.default.model("contobution", ajoSchema);
