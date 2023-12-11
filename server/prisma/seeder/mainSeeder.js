import seedProduct from "./seedProduct.js";
import seedCategory from "./seedCategory.js";
import seedUsers from "./seedUsers.js";
import seedLevel from "./seedLevel.js";

async function main() {
  try {
    await seedCategory();
    await seedProduct();
    await seedLevel();
    await seedUsers();

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

main();
