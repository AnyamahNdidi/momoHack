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
const wallterHistort_1 = __importDefault(require("../model/history/wallterHistort"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
exports.agentToAnotherWalet = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { walletId, amount, decs } = req.body;
        if (!walletId || !amount) {
            return res.status(400).json({ message: "Fields can't be empty" });
        }
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
        console.log("Receiver:", receiver);
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
        console.log("sender:", sender);
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString();
        if (!sender && !receiver) {
            next(new ErrorDefinder_1.mainAppError({
                name: "account not found",
                message: "account can not be created",
                status: ErrorDefinder_1.HTTP.BAD_REQUEST,
                isSuccess: false
            }));
        }
        if (sender && receiver) {
            if (amount > (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance)) {
                return res.status(404).json({
                    message: "Insufficient fund",
                });
            }
            else {
                if ((sender === null || sender === void 0 ? void 0 : sender.walletId) === walletId) {
                    return res.status(404).json({
                        message: "transaction fail",
                    });
                }
                // updating sender walltet balance
                yield walletModel_1.default.findByIdAndUpdate(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id, {
                    balance: (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - amount,
                    credit: 0,
                    debit: amount
                }, { new: true });
                // this is sender history
                const createSenderHistort = yield wallterHistort_1.default.create({
                    message: `You Have Succefully sent ₦${amount}.00 to ${receiver === null || receiver === void 0 ? void 0 : receiver.fullName}`,
                    RefrenceId: (0, uuid_1.v4)(),
                    status: "sent",
                    transactionType: "Money-Transfer- walletId",
                    time: time,
                    date: date,
                    decs,
                    amount: amount
                });
                (_a = sender === null || sender === void 0 ? void 0 : sender.history) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createSenderHistort === null || createSenderHistort === void 0 ? void 0 : createSenderHistort._id));
                sender === null || sender === void 0 ? void 0 : sender.save();
                // updating reciever  walltet balance
                yield walletModel_1.default.findByIdAndUpdate(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id, {
                    balance: (receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + amount,
                    credit: amount,
                    debit: 0
                }, { new: true });
                // this is reciever history
                const createRecievrHistort = yield wallterHistort_1.default.create({
                    message: `Your account has been credited with ₦${amount}.00 from ${sender === null || sender === void 0 ? void 0 : sender.fullName}`,
                    RefrenceId: (0, uuid_1.v4)(),
                    status: "recieved",
                    transactionType: "Money-Recieved - walletId",
                    time: time,
                    date: date,
                    decs,
                    amount: amount
                });
                (_b = receiver === null || receiver === void 0 ? void 0 : receiver.history) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createSenderHistort === null || createSenderHistort === void 0 ? void 0 : createSenderHistort._id));
                receiver === null || receiver === void 0 ? void 0 : receiver.save();
                return res.status(201).json({
                    message: "transaction successfull",
                    result: createSenderHistort
                });
            }
        }
        else {
            return res.status(404).json({
                message: "account not found",
            });
        }
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
