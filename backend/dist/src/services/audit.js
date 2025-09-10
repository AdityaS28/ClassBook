"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const prisma_1 = require("../prisma");
async function logAudit(userId, action, details) {
    await prisma_1.prisma.auditLog.create({
        data: { userId, action, details },
    });
}
//# sourceMappingURL=audit.js.map