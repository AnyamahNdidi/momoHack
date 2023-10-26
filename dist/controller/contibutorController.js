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
exports.fundAjo = exports.createContribution = void 0;
const userModel_1 = __importDefault(require("../model/user/userModel"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ErrorDefinder_1 = require("../middleware/ErrorDefinder");
const contributionModel_1 = __importDefault(require("../model/contribution/contributionModel"));
const mercahntProfile_1 = __importDefault(require("../model/user/mercahntProfile"));
exports.createContribution = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { maerchantId } = req.params;
        const { fixedAmount } = req.body;
        const agentDetails = yield userModel_1.default.findById(req.params.agentId);
        console.log(agentDetails);
        if (!agentDetails) {
            next(new ErrorDefinder_1.mainAppError({
                name: "agent not found",
                message: "contibution can be made can not be created",
                status: ErrorDefinder_1.HTTP.BAD_REQUEST,
                isSuccess: false
            }));
        }
        const merchantDetails = yield mercahntProfile_1.default.findById(req.params.marchantId);
        console.log(merchantDetails);
        if (!merchantDetails) {
            next(new ErrorDefinder_1.mainAppError({
                name: "account not found",
                message: "contibution cant be can not be created",
                status: ErrorDefinder_1.HTTP.BAD_REQUEST,
                isSuccess: false
            }));
        }
        const creatAjoData = yield contributionModel_1.default.create({
            name: "ajo",
            fixedAmount,
            ownerName: merchantDetails === null || merchantDetails === void 0 ? void 0 : merchantDetails.fullName,
            agentIncharge: agentDetails === null || agentDetails === void 0 ? void 0 : agentDetails.fullName,
            totalAmount: 0
        });
        creatAjoData.user = merchantDetails;
        creatAjoData.agent = agentDetails;
        creatAjoData.save();
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "ajo created successfully",
            data: creatAjoData,
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error creating contribution",
            message: "account can not be created" + error.message,
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.fundAjo = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const role = user.role; // Retrieve the role from the user document
        console.log('Role:', role);
        const oneUser = yield userModel_1.default.findById(id)
            .populate('wallet')
            .populate("history");
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
