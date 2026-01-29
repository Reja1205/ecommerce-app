const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe("Checkout reduces stock", () => {
  it("reduces stock after checkout", async () => {
    // 1) register + login user
    const email = uniqueEmail();
    const password = "Password123";

    await request(app).post("/api/auth/register").send({ email, password });

    const loginRes = await request(app).post("/api/auth/login").send({ email, password });
    const cookie = loginRes.headers["set-cookie"];
    expect(cookie).toBeDefined();

    // 2) create a product directly in DB
    const p = await Product.create({
      title: "Test Cable",
      slug: `test-cable-${Date.now()}`,
      description: "For stock test",
      priceUSD: 10,
      stockQty: 5,
      active: true,
      images: [],
    });

    const productId = String(p._id);
    const initialStock = p.stockQty;

    // 3) add to cart qty 2
    const addRes = await request(app)
      .post("/api/cart/items")
      .set("Cookie", cookie)
      .send({ productId, qty: 2 });

    expect(addRes.statusCode).toBe(200);

    // 4) checkout
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Cookie", cookie);

   expect([200, 201]).toContain(checkoutRes.statusCode);


    // 5) verify stock reduced in DB
    const updated = await Product.findById(productId);
    expect(updated).toBeTruthy();
    expect(updated.stockQty).toBe(initialStock - 2);
  });
});
