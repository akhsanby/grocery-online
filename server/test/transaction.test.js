import supertest from "supertest";
import { web } from "../src/app/web.js";
import { v4 as uuid } from "uuid";
import { getUserToken } from "./test-utils.js";

describe("POST /api/transaction", () => {
  it("should can create new transaction", async () => {
    const { token } = await getUserToken(1);

    const result = await supertest(web)
      .post("/api/transaction")
      .set("Authorization", token)
      .send({
        user_id: 1,
        transaction_type: {
          payment_type: "bank_transfer",
          bank_transfer: {
            bank: "permata",
          },
        },
        total_price: 1000,
        product_details: [
          {
            id: uuid(),
            name: "Apel",
            price: 1000,
            quantity: 1,
          },
        ],
      });

    expect(result.body.data.status_code).toBe("201");
    expect(result.body.data.status_message).toBeDefined();
    expect(result.body.data.order_id).toBeDefined();
    expect(result.body.data.transaction_status).toBeDefined();
  });
});
