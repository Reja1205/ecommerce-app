const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe("Checkout integrity", () => {
  it("creates order and clears cart", async () => {
    // 1) register + login
    const email = uniqueEmail();
    const password = "Password123";

    await request(app).post("/api/auth/register").send({ email, password });

    const loginRes = await request(app).post("/api/auth/login").send({ email, password });
    const cookie = loginRes.headers["set-cookie"];
    expect(cookie).toBeDefined();

    // 2) create product (setup)
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

    // 3) add to cart qty 3
    const addRes = await request(app)
      .post("/api/cart/items")
      .set("Cookie", cookie)
      .send({ productId, qty: 3 });

    expect(addRes.statusCode).toBe(200);

    // 4) checkout
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Cookie", cookie);

    expect([200, 201]).toContain(checkoutRes.statusCode);

    // Some backends return {orderId} or just {message}
    const returnedOrderId =
      checkoutRes.body?.orderId ||
      checkoutRes.body?.id ||
      checkoutRes.body?.order?._id ||
      checkoutRes.body?.data?.orderId ||
      checkoutRes.body?.data?.order?._id;

    // 5) cart should be empty after checkout
    const cartRes = await request(app)
      .get("/api/cart")
      .set("Cookie", cookie);

    expect(cartRes.statusCode).toBe(200);

    const cart = cartRes.body?.cart || cartRes.body?.data?.cart;
    expect(cart).toBeTruthy();
    expect(Array.isArray(cart.items)).toBe(true);
    expect(cart.items.length).toBe(0);

    // 6) orders endpoint should include the new order
    const ordersRes = await request(app)
      .get("/api/orders")
      .set("Cookie", cookie);

    expect(ordersRes.statusCode).toBe(200);

    const orders = ordersRes.body?.orders || ordersRes.body?.data?.orders || [];
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);

    // Pick the order:
    // - if checkout returned an id, find it
    // - otherwise assume newest is first (common) or last fallback
    let order = null;
    if (returnedOrderId) {
      order = orders.find((o) => String(o._id) === String(returnedOrderId)) || null;
    }
    if (!order) {
      // try first
      order = orders[0] || orders[orders.length - 1] || null;
    }

    expect(order).toBeTruthy();

    // 7) validate order has items + snapshot fields
    expect(order.items?.length || 0).toBeGreaterThan(0);

    const item = order.items[0];
    expect(item.titleSnapshot).toBeTruthy();
    expect(item.slugSnapshot).toBeTruthy();
    expect(typeof item.priceSnapshotUSD).toBe("number");
    expect(item.qty).toBeGreaterThan(0);
  });
});