const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe("Checkout integrity", () => {
  it("creates order and clears cart", async () => {
    const email = uniqueEmail();
    const password = "Password123";

    await request(app).post("/api/auth/register").send({ email, password });

    const loginRes = await request(app).post("/api/auth/login").send({ email, password });
    const cookie = loginRes.headers["set-cookie"];
    expect(cookie).toBeDefined();

    const p = await Product.create({
      title: "Integrity Product",
      slug: `integrity-${Date.now()}`,
      description: "Order/cart integrity test",
      priceUSD: 15,
      stockQty: 10,
      active: true,
      images: [],
    });

    const productId = String(p._id);

    const addRes = await request(app)
      .post("/api/cart/items")
      .set("Cookie", cookie)
      .send({ productId, qty: 3 });

    expect(addRes.statusCode).toBe(200);

    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Cookie", cookie);

    // 🔥 CI debug: print body if not ok
    if (![200, 201].includes(checkoutRes.statusCode)) {
      // eslint-disable-next-line no-console
      console.log("CHECKOUT_FAILED:", checkoutRes.statusCode, checkoutRes.body);
      throw new Error(
        `Checkout failed with ${checkoutRes.statusCode}: ${JSON.stringify(checkoutRes.body)}`
      );
    }

    // Cart must be empty after checkout
    const cartRes = await request(app).get("/api/cart").set("Cookie", cookie);
    expect(cartRes.statusCode).toBe(200);

    const cart = cartRes.body?.cart || cartRes.body?.data?.cart;
    expect(cart).toBeTruthy();
    expect(Array.isArray(cart.items)).toBe(true);
    expect(cart.items.length).toBe(0);

    // Orders must exist and include snapshots
    const ordersRes = await request(app).get("/api/orders").set("Cookie", cookie);
    expect(ordersRes.statusCode).toBe(200);

    const orders = ordersRes.body?.orders || ordersRes.body?.data?.orders || [];
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);

    const order = orders[0] || orders[orders.length - 1];
    expect(order).toBeTruthy();
    expect(order.items?.length || 0).toBeGreaterThan(0);

    const item = order.items[0];
    expect(item.titleSnapshot).toBeTruthy();
    expect(item.slugSnapshot).toBeTruthy();
    expect(typeof item.priceSnapshotUSD).toBe("number");
    expect(item.qty).toBeGreaterThan(0);
  });
});