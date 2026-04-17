/**
 * Test setup file - runs before each test file
 */
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';

// Mock console.error in tests to reduce noise
vi.spyOn(console, 'error').mockImplementation(() => {});

beforeAll(async () => {
  // MongoDB connection is managed by the test file itself
  // No action needed here
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch {
      // Collection might not exist, skip
    }
  }
});

afterAll(async () => {
  // MongoDB connection is managed by the test file itself
  // No action needed here
  console.log('✅ Tests completed');
});
