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
exports.allMarchant = exports.singleMarchant = exports.loginMarchant = exports.createMarchant = void 0;
const userModel_1 = __importDefault(require("../model/user/userModel"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ErrorDefinder_1 = require("../middleware/ErrorDefinder");
const walletModel_1 = __importDefault(require("../model/wallet/walletModel"));
const userProfile_1 = __importDefault(require("../model/userDetails/userProfile"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
const GenerateToken_1 = require("../utils/GenerateToken");
exports.createMarchant = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, phoneNumber, agentCode } = req.body;
        if (!email || !fullName || !password || !phoneNumber || !agentCode) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const usesExist = yield userModel_1.default.findOne({ email });
        if (usesExist) {
            return res.status(401).json({ message: "email already exist" });
        }
        const checkCode = yield userModel_1.default.findOne({ agentCode: agentCode });
        console.log(checkCode);
        const generateNum = `${Math.floor(Math.random() * 10000000000)}`;
        const createData = yield mercahntProfile_1.default.create({
            fullName,
            email,
            password,
            phoneNumber,
            agentName: checkCode === null || checkCode === void 0 ? void 0 : checkCode.fullName,
            organizationCode: agentCode,
            verify: true,
            walletId: generateNum
        });
        checkCode === null || checkCode === void 0 ? void 0 : checkCode.marchant.push(new mongoose_1.default.Types.ObjectId(createData._id));
        checkCode === null || checkCode === void 0 ? void 0 : checkCode.save();
        const walletData = yield walletModel_1.default.create({
            _id: createData === null || createData === void 0 ? void 0 : createData._id,
            user: fullName,
            balance: 0,
            credit: 0,
            debit: 0,
        });
        createData.wallet = createData;
        createData.save();
        const profiledata = yield userProfile_1.default.create({
            _id: createData === null || createData === void 0 ? void 0 : createData._id,
            LGA: "",
            state: "",
            Area: "",
        });
        profiledata.user = createData;
        profiledata.save();
        return res.status(201).json({
            message: "marchant created sucessfully",
            data: createData,
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
exports.loginMarchant = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Fields can't be empty" });
        }
        let admin;
        // Check if the input is an email or phone number
        if (emailOrPhone.includes('@')) {
            // Input is an email
            admin = yield mercahntProfile_1.default.findOne({ email: emailOrPhone });
        }
        else {
            // Input is a phone number
            admin = yield mercahntProfile_1.default.findOne({ phoneNumber: emailOrPhone });
        }
        if (admin) {
            const matchPassword = yield bcrypt_1.default.compare(password, admin.password);
            if (matchPassword) {
                if (admin.verify) {
                    const _a = admin._doc, { password } = _a, info = __rest(_a, ["password"]);
                    const token = (0, GenerateToken_1.TokenGenerator)({ info });
                    console.log(token);
                    return res.status(ErrorDefinder_1.HTTP.OK).json({
                        message: "login success",
                        data: info,
                        token: token
                    });
                }
                else {
                    res.status(200).json({
                        message: "Account is not verify go to your mail to verify account"
                    });
                }
            }
            else {
                return res.status(ErrorDefinder_1.HTTP.BAD_REQUEST).json({ message: "wrong password" });
            }
        }
        else {
            return res.status(ErrorDefinder_1.HTTP.BAD_REQUEST).json({
                messeage: "Email Can't Be  Found",
            });
        }
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
exports.singleMarchant = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield mercahntProfile_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const role = user.role; // Retrieve the role from the user document
        console.log('Role:', role);
        const oneUser = yield mercahntProfile_1.default.findById(id)
            .populate('wallet');
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "get One User",
            data: oneUser,
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
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
