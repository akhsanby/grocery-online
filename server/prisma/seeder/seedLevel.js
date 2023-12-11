import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedLevel() {
  try {
    const user_level = await prisma.userLevel.createMany({
      data: [{ level_name: "admin" }, { level_name: "customer" }],
    });

    console.log("User Level seeded:", user_level);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
