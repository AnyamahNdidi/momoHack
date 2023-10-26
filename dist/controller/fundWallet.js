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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getmerchantHistory = exports.getagentHistory = exports.fundMerchantWalltent = exports.fundUserWalltent = void 0;
const userModel_1 = __importDefault(require("../model/user/userModel"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ErrorDefinder_1 = require("../middleware/ErrorDefinder");
const walletModel_1 = __importDefault(require("../model/wallet/walletModel"));
const wallterHistort_1 = __importDefault(require("../model/history/wallterHistort"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/token';
const username = '62b7a1b8-34bd-4bc3-a19e-a737e9363a1d';
const password = '762e8f543bc84117813d6b6704c44684';
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
        let data;
        yield (0, node_fetch_1.default)('https://sandbox.momodeveloper.mtn.com/collection/token/', {
            method: 'POST',
            // Request headers
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Basic ${base64Credentials}`,
                'Ocp-Apim-Subscription-Key': subscriptionKey
            },
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(response);
            data = yield response.json();
            console.log(data);
        }))
            .catch((err) => console.error(err));
        const body = {
            "amount": `${amount}`,
            "currency": "EUR",
            "externalId": "8974948",
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": "78657899"
            },
            "payerMessage": `hurry you just founded your walltet with ${amount}`,
            "payeeNote": "TOP UP"
        };
        let status;
        yield (0, node_fetch_1.default)('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
            method: 'POST',
            body: JSON.stringify(body),
            // Request headers
            headers: {
                'Authorization': `Bearer ${data === null || data === void 0 ? void 0 : data.access_token}`,
                'X-Reference-Id': (0, uuid_1.v4)(),
                'X-Target-Environment': 'sandbox',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("this is it", response.status);
            status = yield response.status;
            console.log(response.text());
        }))
            .catch((err) => console.error(err));
        console.log("i wan see this status", typeof status);
        const getUser = yield userModel_1.default.findById(req.params.id);
        console.log(getUser);
        console.log("token", data);
        const getUserWallet = yield walletModel_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (status === 202) {
            console.log(getUserWallet);
            const updatedWallet = yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
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
                result: updatedWallet
            });
        }
        else {
            return res.status(201).json({
                message: "somethin went wrong",
                error: status.message
            });
        }
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in funding wallet",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.fundMerchantWalltent = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
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
        let data;
        yield (0, node_fetch_1.default)('https://sandbox.momodeveloper.mtn.com/collection/token/', {
            method: 'POST',
            // Request headers
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Basic ${base64Credentials}`,
                'Ocp-Apim-Subscription-Key': subscriptionKey
            },
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(response);
            data = yield response.json();
            console.log(data);
        }))
            .catch((err) => console.error(err));
        const body = {
            "amount": `${amount}`,
            "currency": "EUR",
            "externalId": "8974948",
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": "78657899"
            },
            "payerMessage": `hurry you just founded your walltet with ${amount}`,
            "payeeNote": "TOP UP"
        };
        let status;
        yield (0, node_fetch_1.default)('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
            method: 'POST',
            body: JSON.stringify(body),
            // Request headers
            headers: {
                'Authorization': `Bearer ${data === null || data === void 0 ? void 0 : data.access_token}`,
                'X-Reference-Id': (0, uuid_1.v4)(),
                'X-Target-Environment': 'sandbox',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("this is it", response.status);
            status = yield response.status;
            console.log(response.text());
        }))
            .catch((err) => console.error(err));
        console.log("i wan see this status", typeof status);
        const getUser = yield mercahntProfile_1.default.findById(req.params.id);
        console.log(getUser);
        console.log("token", data);
        const getUserWallet = yield walletModel_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (status === 202) {
            console.log(getUserWallet);
            const updatedWallet = yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
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
            (_b = getUser === null || getUser === void 0 ? void 0 : getUser.history) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHistory === null || createHistory === void 0 ? void 0 : createHistory._id));
            getUser === null || getUser === void 0 ? void 0 : getUser.save();
            return res.status(201).json({
                message: "Wallet updated successfully",
                result: updatedWallet
            });
        }
        else {
            return res.status(201).json({
                message: "somethin went wrong",
                error: status.message
            });
        }
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in funding wallet",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.getagentHistory = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.default.findById(id).populate({
            path: "history",
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const role = user.role; // Retrieve the role from the user document
        console.log('Role:', user);
        const _c = user._doc, { password, agentCode, walletId, marchant, phoneNumber, email, verify } = _c, info = __rest(_c, ["password", "agentCode", "walletId", "marchant", "phoneNumber", "email", "verify"]);
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "get all marcahnt",
            data: info,
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
exports.getmerchantHistory = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield mercahntProfile_1.default.findById(id).populate({
            path: "history",
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const role = user.role; // Retrieve the role from the user document
        console.log('Role:', user);
        const _d = user._doc, { password, agentCode, walletId, marchant, phoneNumber, email, verify } = _d, info = __rest(_d, ["password", "agentCode", "walletId", "marchant", "phoneNumber", "email", "verify"]);
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "get all marcahnt",
            data: info,
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
