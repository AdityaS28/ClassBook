"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res
            .status(400)
            .json({
            error: { code: "BAD_REQUEST", message: "Email and password required" },
        });
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res
            .status(401)
            .json({
            error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
        });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res
            .status(401)
            .json({
            error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
        });
    const accessToken = (0, jwt_1.signAccess)({ userId: user.id, role: user.role });
    const refreshToken = (0, jwt_1.signRefresh)({ userId: user.id, role: user.role });
    return res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
        accessToken,
        refreshToken,
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map