import { prisma } from "../src/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Clear existing data (optional but safer for tests)
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  // Seed admin
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@classbook.com",
      password: hashed,
      role: "ADMIN",
    },
  });

  // Seed a regular user
  const userHashed = await bcrypt.hash("user123", 10);
  const user = await prisma.user.create({
    data: {
      email: "user@classbook.com",
      password: userHashed,
      role: "USER",
    },
  });

  // Seed a class with a session
  const classObj = await prisma.class.create({
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
