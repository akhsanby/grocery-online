import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedProducts() {
  try {
    // Array untuk menyimpan data produk yang akan disisipkan
    const productsData = [];

    // Fungsi untuk menghasilkan angka acak antara min dan max
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate 100 data produk
    for (let i = 0; i < 100; i++) {
      const randomCategoryId = getRandomInt(1, 10);
      const productName = `Product ${i + 1}`;
      const productDescription = `Description for Product ${i + 1}`;
      const productPrice = getRandomInt(1, 100);
      const productStockQuantity = getRandomInt(10, 100);
      const productThumbnail = `https://placehold.co/400x400`;

      productsData.push({
        name: productName,
        description: productDescription,
        price: productPrice,
        stock_quantity: productStockQuantity,
        thumbnail: productThumbnail,
        category_id: randomCategoryId,
      });
    }

    // Menyisipkan data produk ke dalam tabel Product
    const seededProducts = await prisma.product.createMany({
      data: productsData,
    });

    console.log("Products seeded:", seededProducts);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}
