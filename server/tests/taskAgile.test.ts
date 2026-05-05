/**
 * Task Agile Flow Unit Tests
 * Tests for Task model instance methods: convertToBug, approveForSprint, etc.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User, { IUser } from '../src/models/User.js';
import Team, { ITeam } from '../src/models/Team.js';
import Project, { IProject } from '../src/models/Project.js';
import Task, { ITask, TaskStatus, TaskPriority, TaskType } from '../src/models/Task.js';

let mongoServer: MongoMemoryServer;
let testUser: IUser;
let testTeam: ITeam;
let testProject: IProject;
let testSprintId: mongoose.Types.ObjectId;
let testCompanyId: mongoose.Types.ObjectId;
let testDeptId: mongoose.Types.ObjectId;

describe('Task Agile Flow Methods', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Initialize stub IDs for required Team references
    testCompanyId = new mongoose.Types.ObjectId();
    testDeptId = new mongoose.Types.ObjectId();

    // Seed required catalogs (task_type, task_status) if not already present
    const Catalog = mongoose.connection.collection('catalogs');
    const existing = await Catalog.findOne({});
    if (!existing) {
      await Catalog.insertMany([
        { type: 'task_type', key: 'task', label: 'Task', labelEn: 'Task', order: 1 },
        { type: 'task_type', key: 'bug', label: 'Bug', labelEn: 'Bug', order: 2 },
        { type: 'task_type', key: 'improvement', label: 'Improvement', labelEn: 'Improvement', order: 3 },
        { type: 'task_status', key: 'backlog', label: 'Backlog', labelEn: 'Backlog', order: 1 },
        { type: 'task_status', key: 'todo', label: 'To Do', labelEn: 'To Do', order: 2 },
        { type: 'task_status', key: 'in_progress', label: 'In Progress', labelEn: 'In Progress', order: 3 },
        { type: 'task_status', key: 'review', label: 'In Review', labelEn: 'In Review', order: 4 },
        { type: 'task_status', key: 'done', label: 'Done', labelEn: 'Done', order: 5 },
        { type: 'task_status', key: 'approved', label: 'Approved', labelEn: 'Approved', order: 6 },
        { type: 'task_priority', key: 'low', label: 'Low', labelEn: 'Low', order: 1 },
        { type: 'task_priority', key: 'medium', label: 'Medium', labelEn: 'Medium', order: 2 },
        { type: 'task_priority', key: 'high', label: 'High', labelEn: 'High', order: 3 },
        { type: 'task_priority', key: 'critical', label: 'Critical', labelEn: 'Critical', order: 4 },
      ]);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear relevant collections
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    testUser = await User.create({
      email: 'agile-test@example.com',
      password: 'Test123!@#',
      name: 'Agile Tester',
      role: 'TEAM_MEMBER',
    });

    testTeam = await Team.create({
      name: 'Agile Team',
      description: 'Team for agile flow tests',
      owner: testUser._id,
      companyId: testCompanyId,
      departmentId: testDeptId,
      members: [{ user: testUser._id, role: 'admin' }],
    });

    testProject = await Project.create({
      name: 'Agile Project',
      description: 'Project for agile flow tests',
      team: testTeam._id,
      owner: testUser._id,
      status: 'active',
      priority: 'medium',
      projectNumber: 'PROJ-001',
    });

    testSprintId = new mongoose.Types.ObjectId();
  });

  describe('convertToBug()', () => {
    it('should convert a task to bug type and set status to todo', async () => {
      const task = await Task.create({
        title: 'Feature that broke',
        description: 'Something went wrong',
        status: 'doing' as TaskStatus,
        priority: 'high' as TaskPriority,
        type: 'task' as TaskType,
        project: testProject._id,
        team: testTeam._id,
        reporter: testUser._id,
        taskNumber: 'TSK-001',
      });

      const reason = 'Found regression in production';
      await task.convertToBug(reason);

      expect(task.type).toBe('bug');
      expect(task.status).toBe('todo');
      expect(task.comments).toHaveLength(1);
      expect(task.comments[0].content).toContain(reason);
      expect(task.comments[0].content).toContain('Converted to bug');
      expect(task.comments[0].author.toString()).toBe(testUser._id.toString());
    });

    it('should append to existing comments', async () => {
      const task = await Task.create({
        title: 'Task with comments',
        description: 'Has existing comments',
        status: 'qa' as TaskStatus,
        priority: 'medium' as TaskPriority,
        type: 'task' as TaskType,
        project: testProject._id,
        team: testTeam._id,
        reporter: testUser._id,
        taskNumber: 'TSK-002',
        comments: [
          { id: 'c1', content: 'Initial comment', author: testUser._id, createdAt: new Date() },
        ],
      });

      await task.convertToBug('Conversion reason');

      expect(task.comments).toHaveLength(2);
      expect(task.comments[1].content).toContain('Conversion reason');
    });

    it('should allow empty reason', async () => {
      const task = await Task.create({
        title: 'Another task',
        description: 'Desc',
        status: 'backlog' as TaskStatus,
        priority: 'low' as TaskPriority,
        type: 'task' as TaskType,
        project: testProject._id,
        team: testTeam._id,
        reporter: testUser._id,
        taskNumber: 'TSK-003',
      });

      await task.convertToBug('');

      expect(task.type).toBe('bug');
      expect(task.status).toBe('todo');
      expect(task.comments).toHaveLength(1);
    });
  });

  describe('approveForSprint()', () => {
    it('should set sprintId and workflowState to approved', async () => {
      const task = await Task.create({
        title: 'Sprint candidate',
        description: 'Ready for sprint',
        status: 'backlog' as TaskStatus,
        priority: 'high' as TaskPriority,
        type: 'task' as TaskType,
        project: testProject._id,
        team: testTeam._id,
        reporter: testUser._id,
        taskNumber: 'TSK-004',
      });

      await task.approveForSprint(testSprintId);

      expect(task.sprintId?.toString()).toBe(testSprintId.toString());
      expect(task.workflowState).toBe('approved');
    });

    it('should overwrite previous sprintId if called again', async () => {
      const task = await Task.create({
        title: 'Reassigned task',
        description: 'Moving sprints',
        status: 'qa' as TaskStatus,
        priority: 'medium' as TaskPriority,
        type: 'task' as TaskType,
        project: testProject._id,
        team: testTeam._id,
        reporter: testUser._id,
        taskNumber: 'TSK-005',
        sprintId: new mongoose.Types.ObjectId(),
      });

      await task.approveForSprint(testSprintId);

      expect(task.sprintId?.toString()).toBe(testSprintId.toString());
    });
  });
});
