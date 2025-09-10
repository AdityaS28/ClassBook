"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTestDB = resetTestDB;
const prisma_1 = require("../../prisma");
async function resetTestDB() {
    // Clean all tables (order matters if you have relations)
    await prisma_1.prisma.booking.deleteMany();
    await prisma_1.prisma.session.deleteMany();
    await prisma_1.prisma.class.deleteMany();
    await prisma_1.prisma.user.deleteMany();
    // Optional: re-seed initial data
    const admin = await prisma_1.prisma.user.create({
        data: {
            email: "admin@classbook.com",
            password: "$2a$10$CwTycUXWue0Thq9StjUM0uJ8vN5kUQ2z/.e5iZi.ZPqJ1lWjZkV.m", // "admin123"
            role: "ADMIN",
        },
    });
    return { admin };
}
//# sourceMappingURL=resetTestDB.js.map