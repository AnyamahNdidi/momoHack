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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const roleEnumValues = ["agent", "marchant", "user"];
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
    },
    phoneNumber: {
        type: String
    },
    verify: {
        type: Boolean,
        default: false
    },
    creditScore: {
        type: Number
    },
    agentCode: {
        type: String
    },
    walletId: {
        type: String
    },
    role: {
        type: String,
        enum: roleEnumValues,
        default: "agent"
    },
    userDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "userDetails"
    },
    wallet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "wallets"
    },
    marchant: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "marchants"
        }],
    history: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "historys"
        }]
}, { timestamps: true });
userSchema.methods.matchPassword = function (enterpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enterpassword, this.password);
    });
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
    });
});
const userModel = mongoose_1.default.model("agents", userSchema);
exports.default = userModel;
