"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordAdmin = await bcryptjs_1.default.hash("admin123", 10);
    const passwordUser = await bcryptjs_1.default.hash("user123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@classbook.com" },
        update: {},
        create: {
            email: "admin@classbook.com",
            password: passwordAdmin,
            role: "ADMIN",
        },
    });
    const user = await prisma.user.upsert({
        where: { email: "user@classbook.com" },
        update: {},
        create: {
            email: "user@classbook.com",
            password: passwordUser,
            role: "USER",
        },
    });
    console.log("Seeded admin:", admin.email);
    console.log("Seeded user:", user.email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map