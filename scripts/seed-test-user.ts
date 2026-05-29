/**
 * Creates or updates the WedGuru test account in MongoDB.
 * Run: npm run seed:user
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TEST_EMAIL = "test@wedguru.app";
const TEST_PASSWORD = "WedGuru@123";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();

  const bcrypt = (await import("bcryptjs")).default;
  const { connectDb } = await import("../lib/db.js");
  const { default: User } = await import("../lib/models/User.js");
  const { default: Wedding } = await import("../lib/models/Wedding.js");

  await connectDb();

  const hashed = await bcrypt.hash(TEST_PASSWORD, 12);
  let user = await User.findOne({ email: TEST_EMAIL });

  if (user) {
    user.password = hashed;
    user.name = "Test Couple";
    user.partnerName = "Alex";
    user.role = "primary";
    user.weddingDate = new Date("2026-12-15T00:00:00.000Z");
    await user.save();
    console.log("Updated existing test user.");
  } else {
    user = await User.create({
      email: TEST_EMAIL,
      password: hashed,
      name: "Test Couple",
      partnerName: "Alex",
      role: "primary",
      weddingDate: new Date("2026-12-15T00:00:00.000Z"),
    });
    console.log("Created test user.");
  }

  const existingWedding = await Wedding.findOne({ userId: user._id });
  if (!existingWedding) {
    await Wedding.create({
      userId: user._id,
      budgetTotal: 20000,
      venue: "Sample Garden Venue",
      weddingDate: user.weddingDate,
    });
    console.log("Created wedding profile.");
  }

  console.log("\n--- Test login ---");
  console.log(`Email:    ${TEST_EMAIL}`);
  console.log(`Password: ${TEST_PASSWORD}`);
  console.log(`URL:      https://wedguru.vercel.app/login`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
