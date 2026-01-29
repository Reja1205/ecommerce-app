const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe("Checkout reduces stock", () => {
  it("reduces stock after checkout", async () => {
    const email = uniqueEmail();
    const password = "Password123";

    await request(app).post("/api/auth/register").send({ email, password });

    const loginRes = await request(app).post("/api/auth/login").send({ email, password });
    const cookie = loginRes.headers["set-cookie"];
    expect(cookie).toBeDefined();

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

    const addRes = await request(app)
      .post("/api/cart/items")
      .set("Cookie", cookie)
      .send({ productId, qty: 2 });

    expect(addRes.statusCode).toBe(200);

    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Cookie", cookie);

    // 🔥 CI debug: print body if not ok
    if (![200, 201].includes(checkoutRes.statusCode)) {
      // This will show in GitHub Actions logs
      // and usually includes error message from your global error handler
      // e.g. { message: 'Server error', error: '...' }
      // or any custom error shape
      // eslint-disable-next-line no-console
      console.log("CHECKOUT_FAILED:", checkoutRes.statusCode, checkoutRes.body);
      throw new Error(
        `Checkout failed with ${checkoutRes.statusCode}: ${JSON.stringify(checkoutRes.body)}`
      );
    }

    const updated = await Product.findById(productId);
    expect(updated).toBeTruthy();
    expect(updated.stockQty).toBe(initialStock - 2);
  });
});