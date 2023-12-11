import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedCategory() {
  try {
    const categories = await prisma.category.createMany({
      data: [{ name: "Elektronik" }, { name: "Fashion" }, { name: "Otomotif" }, { name: "Kecantikan dan Perawatan Pribadi" }, { name: "Olahraga dan Outdoor" }, { name: "Rumah dan Taman" }, { name: "Mainan dan Hobi" }, { name: "Buku dan Alat Tulis" }, { name: "Makanan dan Minuman" }, { name: "Perhiasan dan Jam" }],
    });

    console.log("Categories seeded:", categories);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
