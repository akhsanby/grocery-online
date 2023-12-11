import supertest from "supertest";
import { web } from "../src/app/web.js";
import { removeTestUser, createTestUser, removeTestProduct, getCategory, createManyTestProduct, removeAllTestProduct, createTestProduct, getTestProduct } from "./test-utils.js";

describe("POST /api/product", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
    await removeTestProduct();
  });

  it("should can create new product", async () => {
    const result = await supertest(web)
      .post("/api/product")
      .send({
        name: "test",
        description: "ini hanya testing",
        price: "1000",
        stock_quantity: 123,
        thumbnail: "http://test.com",
        category_id: 1,
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.description).toBe("ini hanya testing");
    expect(result.body.data.price).toBe("1000");
    expect(result.body.data.stock_quantity).toBe(123);
    expect(result.body.data.thumbnail).toBe("http://test.com");

    const category = await getCategory(1);
    expect(category.name).toBe("Elektronik");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/product")
      .send({
        name: "",
        description: "",
        price: "",
        stock_quantity: 123,
        thumbnail: "http://test.com",
        category_id: "1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/product", () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestProduct();
  });

  afterEach(async () => {
    await removeAllTestProduct();
    await removeTestUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(web).get("/api/product").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(10);
    expect(result.body.paging.total_page).toBe(1);
  });

  it("should can search by name", async () => {
    const result = await supertest(web).get("/api/product").set("Authorization", "test").query({
      name: "test1",
    });

    console.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(2);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(2);
    expect(result.body.paging.total_page).toBe(1);
  });
});

describe("PUT /api/product/:productId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });

  afterEach(async () => {
    await removeTestUser();
    await removeTestProduct();
  });

  it("should can update selected product", async () => {
    const testProduct = await getTestProduct();

    const result = await supertest(web)
      .put(`/api/product/${testProduct.product_id}`)
      .send({
        name: "tes lagi",
        description: "ini hanya testing lagi",
        price: "2000",
        stock_quantity: 99,
        thumbnail: "http://testlagi.com",
        category_id: 3,
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("tes lagi");
    expect(result.body.data.description).toBe("ini hanya testing lagi");
    expect(result.body.data.price).toBe("2000");
    expect(result.body.data.stock_quantity).toBe(99);
    expect(result.body.data.thumbnail).toBe("http://testlagi.com");

    const category = await getCategory(3);
    expect(category.name).toBe("Otomotif");
  });

  it("should reject if request is invalid", async () => {
    const testProduct = await getTestProduct();

    const result = await supertest(web)
      .put(`/api/product/${testProduct.product_id}`)
      .send({
        name: "",
        description: "",
        price: "",
        stock_quantity: 123,
        thumbnail: "http://test.com",
        category_id: "1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/product/:productId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });

  afterEach(async () => {
    await removeAllTestProduct();
    await removeTestUser();
  });

  it("should can delete product", async () => {
    let testProduct = await getTestProduct();

    const result = await supertest(web)
      .delete("/api/product/" + testProduct.product_id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testProduct = await getTestProduct();
    expect(testProduct).toBeNull();
  });

  it("should reject if product is not found", async () => {
    let testProduct = await getTestProduct();

    const result = await supertest(web)
      .delete("/api/product/" + (testProduct.product_id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/product/:productId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });

  afterEach(async () => {
    await removeAllTestProduct();
    await removeTestUser();
  });

  it("should can get product", async () => {
    let testProduct = await getTestProduct();

    const result = await supertest(web)
      .get("/api/product/" + testProduct.product_id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.product_id).toBe(testProduct.product_id);
    expect(result.body.data.name).toBe(testProduct.name);
    expect(result.body.data.description).toBe(testProduct.description);
    expect(result.body.data.stock_quantity).toBe(testProduct.stock_quantity);
    expect(result.body.data.thumbnail).toBe(testProduct.thumbnail);

    const category = await getCategory(1);
    expect(category.name).toBe("Elektronik");
  });

  it("should return 404 if product is not found", async () => {
    let testProduct = await getTestProduct();

    const result = await supertest(web)
      .get("/api/product/" + (testProduct.product_id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});
