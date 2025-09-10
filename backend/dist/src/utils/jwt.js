"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccess = signAccess;
exports.signRefresh = signRefresh;
exports.verifyAccess = verifyAccess;
exports.verifyRefresh = verifyRefresh;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecretaccess";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
function signAccess(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
function signRefresh(payload) {
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}
function verifyAccess(token) {
    return jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
}
function verifyRefresh(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
}
//# sourceMappingURL=jwt.js.map