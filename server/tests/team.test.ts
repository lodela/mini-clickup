/**
 * Team API Integration Tests
 * Tests for all team-related endpoints
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import User, { IUser } from '../src/models/User.js';
import Team, { ITeam } from '../src/models/Team.js';
import jwt from 'jsonwebtoken';
import authRoutes from '../src/routes/auth.js';
import teamRoutes from '../src/routes/team.js';
import { notFound, errorHandler } from '../src/middleware/errorHandler.js';

/**
 * Test Data Interfaces
 */
interface TestUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  token: string;
}

interface TestTeam {
  _id: string;
  name: string;
  description?: string;
  owner: string;
}

/**
 * Global test variables
 */
let mongoServer: MongoMemoryServer;
let testApp: Express;
let testUsers: Record<string, TestUser> = {};
let testTeams: Record<string, TestTeam> = {};

/**
 * Helper function to generate auth token
 */
function generateToken(userId: string, email: string, role: string = 'user'): string {
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign(
    {
      userId,
      email,
      role,
      type: 'access',
    },
    secret,
    {
      expiresIn: '15m',
      issuer: 'mini-clickup-api',
      audience: 'mini-clickup-client',
    }
  );
}

/**
 * Helper function to create a test user
 */
async function createUser(userData: Partial<TestUser> = {}): Promise<TestUser> {
  const email = userData.email || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@test.com`;
  const user = await User.create({
    email,
    password: userData.password || 'Test123!@#',
    name: userData.name || 'Test User',
    role: userData.role || 'USER_C',
  });

  const token = generateToken(user._id.toString(), user.email, user.role);

  const testUser: TestUser = {
    _id: user._id.toString(),
    email: user.email,
    password: userData.password || 'Test123!@#',
    name: user.name,
    role: user.role,
    token,
  };

  return testUser;
}

/**
 * Helper function to create a test team
 */
async function createTeam(teamData: Partial<TestTeam> & { owner: string }): Promise<TestTeam> {
  const team = await Team.create({
    name: teamData.name || `Team_${Date.now()}`,
    description: teamData.description || 'Test team description',
    owner: teamData.owner,
    members: [
      {
        user: teamData.owner,
        role: 'admin',
        joinedAt: new Date(),
      },
    ],
  });

  const testTeam: TestTeam = {
    _id: team._id.toString(),
    name: team.name,
    description: team.description || undefined,
    owner: teamData.owner,
  };

  return testTeam;
}

/**
 * Create test Express app
 */
function createTestApp(): Express {
  const app = express();
  
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/teams', teamRoutes);
  
  // Error handling
  app.use(notFound);
  app.use(errorHandler);
  
  return app;
}

/**
 * Test Suite: Team API
 */
describe('Team API', () => {
  /**
   * Setup: Start in-memory MongoDB and create test data
   */
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory MongoDB
    await mongoose.connect(mongoUri);

    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = mongoUri;
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_ROUNDS = '4';

    // Create test Express app
    testApp = createTestApp();

    // Create test users
    testUsers.owner = await createUser({
      email: 'owner@test.com',
      name: 'Team Owner',
    });

    testUsers.admin = await createUser({
      email: 'admin@test.com',
      name: 'Team Admin',
    });

    testUsers.member = await createUser({
      email: 'member@test.com',
      name: 'Team Member',
    });

    testUsers.guest = await createUser({
      email: 'guest@test.com',
      name: 'Team Guest',
    });

    testUsers.nonMember = await createUser({
      email: 'nonmember@test.com',
      name: 'Non Member',
    });

    // Create test team with all members initially
    const team = await Team.create({
      name: 'Test Team',
      description: 'A test team for unit tests',
      owner: testUsers.owner._id,
      members: [
        { user: testUsers.owner._id, role: 'admin', joinedAt: new Date() },
        { user: testUsers.admin._id, role: 'admin', joinedAt: new Date() },
        { user: testUsers.member._id, role: 'member', joinedAt: new Date() },
        { user: testUsers.guest._id, role: 'guest', joinedAt: new Date() },
      ],
    });

    testTeams.main = team;

    // Update users' teams array
    await User.updateMany(
      { _id: { $in: [testUsers.owner._id, testUsers.admin._id, testUsers.member._id, testUsers.guest._id] } },
      { $set: { teams: [team._id] } }
    );
  });

  /**
   * Teardown: Close MongoDB connection
   */
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  /**
   * Reset database before each test
   */
  beforeEach(async () => {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch {
        // Collection might not exist, skip
      }
    }

    // Recreate test data
    testUsers.owner = await createUser({ email: 'owner@test.com', name: 'Team Owner' });
    testUsers.admin = await createUser({ email: 'admin@test.com', name: 'Team Admin' });
    testUsers.member = await createUser({ email: 'member@test.com', name: 'Team Member' });
    testUsers.nonMember = await createUser({ email: 'nonmember@test.com', name: 'Non Member' });

    // Create test team with all members initially
    const team = await Team.create({
      name: 'Test Team',
      description: 'A test team for unit tests',
      owner: testUsers.owner._id,
      members: [
        { user: testUsers.owner._id, role: 'admin', joinedAt: new Date() },
        { user: testUsers.admin._id, role: 'admin', joinedAt: new Date() },
        { user: testUsers.member._id, role: 'member', joinedAt: new Date() },
        { user: testUsers.guest._id, role: 'guest', joinedAt: new Date() },
      ],
    });

    testTeams.main = team;

    // Update users' teams array
    await User.updateMany(
      { _id: { $in: [testUsers.owner._id, testUsers.admin._id, testUsers.member._id, testUsers.guest._id] } },
      { $set: { teams: [team._id] } }
    );
  });

  /**
   * Test Suite: POST /api/teams
   */
  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const teamData = {
        name: 'New Test Team',
        description: 'Test description',
      };

      const response = await request(testApp)
        .post('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(teamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Team created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(teamData.name);
      expect(response.body.data.description).toBe(teamData.description);
      expect(response.body.data.owner._id).toBe(testUsers.owner._id);
      expect(response.body.data.memberCount).toBe(1);
    });

    it('should require authentication', async () => {
      const teamData = { name: 'Unauthorized Team' };

      const response = await request(testApp)
        .post('/api/teams')
        .send(teamData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should validate required fields', async () => {
      const invalidTeamData = { description: 'Missing name' };

      const response = await request(testApp)
        .post('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(invalidTeamData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation error');
    });

    it('should validate name length', async () => {
      const invalidTeamData = { name: 'A'.repeat(101) };

      const response = await request(testApp)
        .post('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(invalidTeamData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toBeDefined();
    });

    it('should validate avatar URL format', async () => {
      const teamData = {
        name: 'Test Team',
        avatar: 'invalid-url',
      };

      const response = await request(testApp)
        .post('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(teamData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: GET /api/teams
   */
  describe('GET /api/teams', () => {
    it('should return user\'s teams', async () => {
      const response = await request(testApp)
        .get('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toBe('Test Team');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get('/api/teams')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should include member count', async () => {
      const response = await request(testApp)
        .get('/api/teams')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.data[0].memberCount).toBe(4); // owner + 3 members
    });

    it('should include user role', async () => {
      const response = await request(testApp)
        .get('/api/teams')
        .set('Authorization', `Bearer ${testUsers.member.token}`)
        .expect(200);

      expect(response.body.data[0].userRole).toBe('member');
    });
  });

  /**
   * Test Suite: GET /api/teams/:id
   */
  describe('GET /api/teams/:id', () => {
    it('should return team by ID', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testTeams.main._id);
      expect(response.body.data.name).toBe('Test Team');
      expect(response.body.data.members).toBeDefined();
    });

    it('should reject non-members', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.nonMember.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid team ID format', async () => {
      const response = await request(testApp)
        .get('/api/teams/invalid-id')
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent team', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(testApp)
        .get(`/api/teams/${fakeId}`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  /**
   * Test Suite: PUT /api/teams/:id
   */
  describe('PUT /api/teams/:id', () => {
    it('should update team (owner only)', async () => {
      const updateData = {
        name: 'Updated Team Name',
        description: 'Updated description',
      };

      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it('should reject non-owner updates', async () => {
      const updateData = { name: 'Hacked Team' };

      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.member.token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}`)
        .send({ name: 'Unauthorized' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: DELETE /api/teams/:id
   */
  describe('DELETE /api/teams/:id', () => {
    it('should delete team (owner only)', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Team deleted successfully');

      // Verify team is deleted
      const deletedTeam = await Team.findById(testTeams.main._id);
      expect(deletedTeam).toBeNull();
    });

    it('should reject non-owner delete', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: POST /api/teams/:id/members
   */
  describe('POST /api/teams/:id/members', () => {
    it('should add member (admin only)', async () => {
      const newMember = await createUser({ email: 'newmember@test.com' });

      const memberData = {
        email: newMember.email,
        role: 'member' as const,
      };

      const response = await request(testApp)
        .post(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(memberData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Member added successfully');
      expect(response.body.data.members).toBeDefined();

      // Verify member was added
      const team = await Team.findById(testTeams.main._id);
      expect(team?.members.length).toBe(4);
    });

    it('should validate email', async () => {
      const invalidData = {
        email: 'invalid-email',
        role: 'member' as const,
      };

      const response = await request(testApp)
        .post(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate members', async () => {
      const memberData = {
        email: testUsers.member.email,
        role: 'member' as const,
      };

      const response = await request(testApp)
        .post(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(memberData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CONFLICT');
    });

    it('should reject non-existent user email', async () => {
      const memberData = {
        email: 'nonexistent@test.com',
        role: 'member' as const,
      };

      const response = await request(testApp)
        .post(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(memberData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: DELETE /api/teams/:id/members/:userId
   */
  describe('DELETE /api/teams/:id/members/:userId', () => {
    it('should remove member (admin only)', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}/members/${testUsers.guest._id}`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Member removed successfully');

      // Verify member was removed
      const team = await Team.findById(testTeams.main._id);
      const removedMember = team?.members.find(
        (m) => m.user.toString() === testUsers.guest._id
      );
      expect(removedMember).toBeUndefined();
    });

    it('should prevent removing last owner', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}/members/${testUsers.owner._id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .delete(`/api/teams/${testTeams.main._id}/members/${testUsers.guest._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: PUT /api/teams/:id/members/:userId/role
   */
  describe('PUT /api/teams/:id/members/:userId/role', () => {
    it('should update member role (admin only)', async () => {
      const roleData = {
        role: 'admin' as const,
      };

      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}/members/${testUsers.member._id}/role`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(roleData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Member role updated successfully');

      // Verify role was updated
      const team = await Team.findById(testTeams.main._id);
      const updatedMember = team?.members.find(
        (m) => m.user.toString() === testUsers.member._id
      );
      expect(updatedMember?.role).toBe('admin');
    });

    it('should prevent changing owner\'s role', async () => {
      const roleData = {
        role: 'member' as const,
      };

      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}/members/${testUsers.owner._id}/role`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send(roleData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should validate role enum', async () => {
      const invalidRoleData = {
        role: 'superadmin',
      };

      const response = await request(testApp)
        .put(`/api/teams/${testTeams.main._id}/members/${testUsers.member._id}/role`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .send(invalidRoleData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test Suite: GET /api/teams/:id/members
   */
  describe('GET /api/teams/:id/members', () => {
    it('should return team members', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.owner.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(4); // owner + 3 members
      expect(response.body.data[0].role).toBe('admin'); // owner is always admin
    });

    it('should reject non-members', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}/members`)
        .set('Authorization', `Bearer ${testUsers.nonMember.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get(`/api/teams/${testTeams.main._id}/members`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
