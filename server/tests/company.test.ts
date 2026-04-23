import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Company from "../src/models/Company";
import User from "../src/models/User";

let mongoServer: MongoMemoryServer;

describe("Company Model Validation", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should create a company with valid fiscal data", async () => {
    const user = await User.create({
      name: "Admin User",
      email: `admin-${Date.now()}@test.com`,
      password: "password123",
      role: "CLIENT_A"
    });

    const companyData = {
      name: "Test Company",
      legalName: "Test S.A.",
      rfc: "TEST123456XYZ",
      fiscalAddress: "123 Test St",
      primaryContact: user._id,
      status: "Active"
    };

    const company = await Company.create(companyData);

    expect(company.name).toBe("Test Company");
    expect(company.rfc).toBe("TEST123456XYZ");
  });

  it("should fail without RFC", async () => {
    const companyData = {
      name: "No RFC Corp",
      legalName: "No RFC S.A.",
      fiscalAddress: "123 Test St",
    };

    try {
      await Company.create(companyData);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.errors.rfc).toBeDefined();
    }
  });
});
