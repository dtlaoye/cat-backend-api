const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
require("./testDB");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not allow duplicate username", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Username already taken");
  });

  it("should login with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with incorrect password", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});
