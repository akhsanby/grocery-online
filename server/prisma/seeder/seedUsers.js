import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function seedUsers() {
  try {
    // Fungsi untuk menghasilkan hash dari password menggunakan bcrypt
    async function hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }

    // Data pengguna yang akan disisipkan
    const usersData = [
      {
        first_name: "akhsan",
        last_name: "bayu",
        email: "akhsan@gmail.com",
        password: await hashPassword("rahasia1"),
        user_level_id: 1,
      },
      {
        first_name: "bayu",
        last_name: "rian",
        email: "rian@gmail.com",
        password: await hashPassword("rahasia2"),
        user_level_id: 2,
      },
    ];

    // Menyisipkan data pengguna ke dalam tabel User
    const seededUsers = await prisma.user.createMany({
      data: usersData,
    });

    console.log("Users seeded:", seededUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}
