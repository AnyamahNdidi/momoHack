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
exports.allMarchant = exports.fundMerchantUserWalltent = exports.fundUserWalltent = void 0;
const userModel_1 = __importDefault(require("../model/user/userModel"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ErrorDefinder_1 = require("../middleware/ErrorDefinder");
const walletModel_1 = __importDefault(require("../model/wallet/walletModel"));
const wallterHistort_1 = __importDefault(require("../model/history/wallterHistort"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
const axios_1 = __importDefault(require("axios"));
const generateaccessToken = () => {
};
const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/token';
const username = '62b7a1b8-34bd-4bc3-a19e-a737e9363a1d';
const password = '145757bfcab94416998a7df2718411e3';
const subscriptionKey = '49887ac74d9945ba8488053077c7cfff';
exports.fundUserWalltent = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const headers = {
            'Authorization': `Basic ${base64Credentials}`,
            'Ocp-Apim-Subscription-Key': subscriptionKey
        };
        console.log("sd", headers);
        yield axios_1.default.post(apiUrl, null, { headers })
            .then(response => {
            // Handle the API response here
            console.log("show data", response.data);
        })
            .catch(error => {
            // Handle errors here
            console.error('API request error:', error);
        });
        const getUser = yield userModel_1.default.findById(req.params.id);
        console.log(getUser);
        const getUserWallet = yield walletModel_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        console.log(getUserWallet);
        yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
            balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) + amount,
            credit: amount,
        }, { new: true }));
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString(); // getting current time
        const createHistory = yield wallterHistort_1.default.create({
            RefrenceId: (0, uuid_1.v4)(),
            recipients: getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.user,
            status: "sent",
            transactionType: "Fund-wallet",
            message: `hurry you just founded your walltet with ${amount}`,
            time: time,
            date: date,
            amount: amount
        });
        (_a = getUser === null || getUser === void 0 ? void 0 : getUser.history) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHistory === null || createHistory === void 0 ? void 0 : createHistory._id));
        getUser === null || getUser === void 0 ? void 0 : getUser.save();
        return res.status(201).json({
            message: "Wallet updated successfully",
            result: getUserWallet
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.fundMerchantUserWalltent = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const getUser = yield mercahntProfile_1.default.findById(req.params.id);
        const getUserWallet = yield walletModel_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        console.log(getUserWallet);
        yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
            balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) + amount,
            credit: amount,
        }, { new: true }));
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString(); // getting current time
        const createHistory = yield wallterHistort_1.default.create({
            _id: getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id,
            RefrenceId: (0, uuid_1.v4)(),
            recipients: getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.user,
            status: "sent",
            transactionType: "Fund-wallet",
            message: `hurry you just founded your walltet with ${amount}`,
            time: time,
            date: date,
            amount: amount
        });
        (_b = getUser === null || getUser === void 0 ? void 0 : getUser.history) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHistory === null || createHistory === void 0 ? void 0 : createHistory._id));
        return res.status(201).json({
            message: "Wallet updated successfully",
            result: getUserWallet
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.allMarchant = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const role = user.role; // Retrieve the role from the user document
        console.log('Role:', user);
        const getAllUser = yield mercahntProfile_1.default.find({ organizationCode: user.agentCode });
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "get all marcahnt",
            data: getAllUser,
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error getting wallet",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
