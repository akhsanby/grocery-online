import supertest from "supertest";
import { web } from "../src/app/web.js";
import { createTestUser, removeTestUser } from "./test-utils.js";

describe("GET /api/category", () => {
  beforeEach(async () => {
    await createTestUser();
    // await createManyTestProduct();
  });

  afterEach(async () => {
    // await removeAllTestProduct();
    await removeTestUser();
  });

  it("should can get all", async () => {
    const result = await supertest(web).get("/api/category").set("Authorization", "test");
    expect(result.status).toBe(200);
  });
});
