import { execSync } from "child_process";
import { prisma } from "../../prisma";

export async function resetTestDB() {
  // Clean all tables (order matters if you have relations)
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  // Optional: re-seed initial data
  const admin = await prisma.user.create({
    data: {
      email: "admin@classbook.com",
      password: "$2a$10$CwTycUXWue0Thq9StjUM0uJ8vN5kUQ2z/.e5iZi.ZPqJ1lWjZkV.m", // "admin123"
      role: "ADMIN",
    },
  });

  return { admin };
}
