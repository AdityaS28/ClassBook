import { execSync } from "child_process";

module.exports = async () => {
  console.log("🧹 Resetting & seeding test database...");

  // Reset DB and apply migrations
  execSync(
    "npx dotenv -e .env.test -- npx prisma migrate reset --force --skip-seed",
    {
      stdio: "inherit",
    }
  );

  // Seed test DB
  execSync("npm run test:seed", { stdio: "inherit" });

  console.log("✅ Test DB ready");
};
