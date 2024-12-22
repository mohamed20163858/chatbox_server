import request from "supertest";
import app from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    // Clean up the users table before each test
    await prisma.user.deleteMany({});
  });

  describe("POST /api/v1/auth/register", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        fullName: "Test User",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should not allow duplicate emails", async () => {
      // First registration
      await request(app).post("/api/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        username: "testuser1",
        fullName: "Test User",
      });

      // Second registration with same email
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        username: "testuser2",
        fullName: "Test User",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        fullName: "Test User",
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });
});
