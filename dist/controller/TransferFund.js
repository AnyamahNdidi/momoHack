"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentToAnotherWalet = void 0;
const userModel_1 = __importDefault(require("../model/user/userModel"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ErrorDefinder_1 = require("../middleware/ErrorDefinder");
const walletModel_1 = __importDefault(require("../model/wallet/walletModel"));
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
exports.agentToAnotherWalet = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { walletId, amount } = req.body;
        let receiverType;
        let receiver;
        let receiverWallet;
        // Check if the walletId belongs to a merchant
        receiver = yield mercahntProfile_1.default.findOne({ walletId: walletId });
        if (receiver) {
            receiverType = "merchant";
            receiverWallet = yield walletModel_1.default.findOne({ _id: receiver === null || receiver === void 0 ? void 0 : receiver._id });
        }
        else {
            // If it's not a merchant, check if it belongs to a user
            receiver = yield userModel_1.default.findOne({ walletId: walletId });
            if (receiver) {
                receiverType = "agent";
                receiverWallet = yield walletModel_1.default.findOne({ _id: receiver === null || receiver === void 0 ? void 0 : receiver._id });
            }
        }
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        // console.log("Receiver Type:", receiverType);
        console.log("Receiver Wallet:", receiverWallet);
        // console.log("Receiver:", receiver);
        // checking for sender
        const { senderId } = req.params;
        let senderType;
        let sender;
        let senderWallet;
        // Check if the walletId belongs to a merchant
        sender = yield mercahntProfile_1.default.findById(senderId);
        if (sender) {
            senderType = "merchant";
            senderWallet = yield walletModel_1.default.findOne({ _id: sender === null || sender === void 0 ? void 0 : sender._id });
        }
        else {
            // If it's not a merchant, check if it belongs to a user
            sender = yield userModel_1.default.findById(senderId);
            if (sender) {
                senderType = "agent";
                senderWallet = yield walletModel_1.default.findOne({ _id: sender === null || sender === void 0 ? void 0 : sender._id });
            }
        }
        if (!sender) {
            return res.status(404).json({ message: "sender not found" });
        }
        // console.log("sender Type:", senderType);
        console.log("sender Wallet:", senderWallet);
        // console.log("sender:", sender);
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString();
        return res.status(201).json({
            message: "get all marcahnt",
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in sending Wallet",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
