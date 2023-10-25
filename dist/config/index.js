"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = exports.CREDENTIALS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || 'development'}.online` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
const { DB_HOST, DB_PASSWORD, DB_NAME } = process.env;
exports.dbConnection = {
    url: `mongodb+srv://user:NigeriaSecurity240@cluster0.zc4mc02.mongodb.net/momohack`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
};
