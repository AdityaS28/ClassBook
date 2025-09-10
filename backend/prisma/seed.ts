import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  const passwordUser = await bcrypt.hash("user123", 10);

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
