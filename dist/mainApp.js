"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const ErrorHandler_1 = require("./middleware/ErrorHandler");
const userRouter_1 = __importDefault(require("./router/userRouter"));
const marchantRouter_1 = __importDefault(require("./router/marchantRouter"));
const fundWalletRouter_1 = __importDefault(require("./router/fundWalletRouter"));
const mainApp = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)())
        .use("/api/v1", userRouter_1.default)
        .use("/api/v1", marchantRouter_1.default)
        .use("/api/v1", fundWalletRouter_1.default)
        .use((0, cookie_session_1.default)({
        name: "session",
        keys: ["key1", "keys2"],
        maxAge: 24 * 60 * 60 * 1000
    }))
        .use((req, res, next) => {
        if (req.session && !req.session.regenerate) {
            req.session.regenerate = (cb) => {
                return cb();
            };
            if (req.session && !req.session.save) {
                req.session.save = (cb) => {
                    return cb();
                };
            }
            next();
        }
    })
        .get("/success", (req, res) => {
        res.status(200).json({
            message: `Auth Successful `,
        });
    })
        .get("/failure", (req, res) => {
        res.status(200).json({
            message: "Something went wrong",
        });
    })
        //   .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
        .get("/", (req, res) => {
        res.status(200).json({
            message: "api is ready"
        });
    })
        .get("/api/ejs:id", (req, res) => {
        const id = req.params.id;
        const name = "edwin";
        return res.render("AdminVerification", { id, name });
    })
        .use(ErrorHandler_1.errorHandler);
};
exports.mainApp = mainApp;
