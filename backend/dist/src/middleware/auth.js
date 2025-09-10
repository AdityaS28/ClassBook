"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecretaccess";
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: { code: "UNAUTHORIZED", message: "No token provided" } });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
    }
}
// Role-based authorization middleware
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({
                error: { code: "FORBIDDEN", message: "Insufficient permissions" },
            });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map