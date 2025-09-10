"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    // Clear existing data (optional but safer for tests)
    await prisma_1.prisma.booking.deleteMany();
    await prisma_1.prisma.session.deleteMany();
    await prisma_1.prisma.class.deleteMany();
    await prisma_1.prisma.user.deleteMany();
    // Seed admin
    const hashed = await bcryptjs_1.default.hash("admin123", 10);
    await prisma_1.prisma.user.create({
        data: {
            email: "admin@classbook.com",
            password: hashed,
            role: "ADMIN",
        },
    });
    // Seed a regular user
    const userHashed = await bcryptjs_1.default.hash("user123", 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: "user@classbook.com",
            password: userHashed,
            role: "USER",
        },
    });
    // Seed a class with a session
    const classObj = await prisma_1.prisma.class.create({
        data: {
            name: "Math 101",
            sessions: {
                create: {
                    dateTime: new Date(Date.now() + 3600 * 1000), // 1h from now
                    capacity: 2,
                },
            },
        },
        include: { sessions: true },
    });
    console.log("Seeded test DB:", { user, class: classObj });
}
main()
    .then(() => {
    console.log("✅ Test DB seeded");
    process.exit(0);
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.test.js.map