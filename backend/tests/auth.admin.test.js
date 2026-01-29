const request = require("supertest");
const app = require("../src/app");

const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe("Auth + Admin protection", () => {
  it("register works", async () => {
    const email = uniqueEmail();

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "Password123" });

    // ✅ Must be success (some APIs return 200, some 201)
    expect([200, 201]).toContain(res.statusCode);

    // ✅ Support multiple possible response shapes
    const returnedEmail =
      res.body?.user?.email || res.body?.email || res.body?.data?.user?.email;

    const returnedRole =
      res.body?.user?.role || res.body?.role || res.body?.data?.user?.role;

    expect(returnedEmail).toBe(email);

    // role may be returned or default to "user"
    if (returnedRole) {
      expect(returnedRole).toBe("user");
    }
  });

  it("non-admin cannot access admin orders", async () => {
    const email = uniqueEmail();
    const password = "Password123";

    // register
    await request(app).post("/api/auth/register").send({ email, password });

    // login -> get cookie
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(loginRes.statusCode).toBe(200);

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // call admin endpoint with user cookie -> should be 403
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(403);
  });
});
