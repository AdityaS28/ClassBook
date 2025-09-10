"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequests = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)({
    transport: {
        target: "pino-pretty",
        options: { colorize: true },
    },
    level: process.env.LOG_LEVEL || "info",
});
const logRequests = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        exports.logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            timestamp: new Date().toISOString(),
        });
    });
    next();
};
exports.logRequests = logRequests;
//# sourceMappingURL=logger.js.map