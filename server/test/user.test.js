import supertest from "supertest";
import { web } from "../src/app/web.js";
import { removeTestUser, createTestUser, getTestUser } from "./test-utils.js";
import bcrypt from "bcrypt";

describe("POST /api/users/register", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users/register").send({
      first_name: "test",
      last_name: "test",
      email: "test@gmail.com",
      password: "rahasia",
      user_level_id: 1,
    });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.user_level_id).toBe(1);
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/register").send({
      first_name: "",
      last_name: "",
      email: "test",
      password: "",
      user_level_id: 1,
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if email is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "salah@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.user_level_id).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update user", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      first_name: "Rian",
      last_name: "Rian",
      password: "sangat rahasia",
      address: "Jalan kenapa",
      phone_number: "083203883",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("Rian");
    expect(result.body.data.last_name).toBe("Rian");
    expect(result.body.data.address).toBe("Jalan kenapa");
    expect(result.body.data.phone_number).toBe("083203883");

    const user = await getTestUser();
    expect(await bcrypt.compare("sangat rahasia", user.password)).toBe(true);
  });

  it("should can update firstname only", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      first_name: "Rian",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("Rian");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.address).toBe("Jalan merdeka");
    expect(result.body.data.phone_number).toBe("123456789");
  });

  it("should can update lastname only", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      last_name: "Rian",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("Rian");
    expect(result.body.data.address).toBe("Jalan merdeka");
    expect(result.body.data.phone_number).toBe("123456789");

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
  });

  it("should can update password only", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      password: "rahasia sangat",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.address).toBe("Jalan merdeka");
    expect(result.body.data.phone_number).toBe("123456789");

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasia sangat", user.password)).toBe(true);
  });

  it("should reject if request is not valid", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "salah").send({});

    expect(result.status).toBe(401);
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can logout", async () => {
    const result = await supertest(web).delete("/api/users/logout").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it("should reject logout if token is invalid", async () => {
    const result = await supertest(web).delete("/api/users/logout").set("Authorization", "salah");

    expect(result.status).toBe(401);
  });
});
