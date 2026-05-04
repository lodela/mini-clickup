/**
 * Company Service — fuzzy search, domain extraction, slug normalization, create, delete cascade.
 */
import Fuse from "fuse.js";
import Company, { ICompany } from "../models/Company.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Team from "../models/Team.js";
import Project from "../models/Project.js";
import Epic from "../models/Epic.js";
import Story from "../models/Story.js";
import Task from "../models/Task.js";
import Sprint from "../models/Sprint.js";
import Invitation from "../models/Invitation.js";
import ActionLog from "../models/ActionLog.js";
import mongoose from "mongoose";

const FUZZY_THRESHOLD = 0.2; // Fuse score: 0=perfect match, 1=no match → 0.2 ≈ 80% Levenshtein

/** Normalize a company name into a URL-safe slug */
export function normalizeSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/** Extract domain from an email address */
export function extractDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase().trim() ?? "";
}

export interface FuzzyMatch {
  company: ICompany;
  score: number; // 0–1 (1 = perfect)
}

/**
 * Search companies by name (fuzzy, 80% threshold) or by emailDomain.
 * Returns ranked matches.
 */
export async function fuzzySearch(
  name: string,
  emailDomain?: string
): Promise<FuzzyMatch[]> {
  const candidates = await Company.find({ status: "Active" }).lean();

  const results: FuzzyMatch[] = [];

  // Domain match (exact) — highest priority
  if (emailDomain) {
    const domainMatches = candidates.filter(
      (c) => c.emailDomain === emailDomain.toLowerCase()
    );
    domainMatches.forEach((c) => results.push({ company: c as unknown as ICompany, score: 1 }));
  }

  // Fuzzy name match
  const fuse = new Fuse(candidates, {
    keys: ["name", "legalName"],
    threshold: FUZZY_THRESHOLD,
    includeScore: true,
  });

  const fuseResults = fuse.search(name);
  fuseResults.forEach(({ item, score }) => {
    // Avoid duplicates from domain match
    const alreadyAdded = results.some(
      (r) => String((r.company as any)._id) === String(item._id)
    );
    if (!alreadyAdded) {
      results.push({
        company: item as unknown as ICompany,
        score: 1 - (score ?? 1),
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

export interface CreateCompanyData {
  name: string;
  website?: string;
  teamSize?: string;
  socials?: Record<string, string>;
  emailDomain: string;
  founderId: string | mongoose.Types.ObjectId;
}

/** Create a new company and assign the founder as primaryContact and superAdmin */
export async function createCompany(data: CreateCompanyData): Promise<ICompany> {
  const slug = normalizeSlug(data.name);

  const company = await Company.create({
    name: data.name,
    slug,
    emailDomain: data.emailDomain,
    website: data.website ?? null,
    teamSize: data.teamSize ?? null,
    socials: data.socials ?? {},
    primaryContact: data.founderId,
    superAdmin: data.founderId,
    status: "Active",
  });

  // Link company back to the user
  await User.findByIdAndUpdate(data.founderId, { companyId: company._id });

  return company;
}

/** Link an existing company to a user */
export async function linkUserToCompany(
  userId: string | mongoose.Types.ObjectId,
  companyId: string | mongoose.Types.ObjectId
): Promise<void> {
  await User.findByIdAndUpdate(userId, { companyId });
}

/**
 * Delete a company and ALL of its associated data in cascade order.
 * Cascade order (leaf → root):
 *   Stories → Tasks → Epics → Sprints → Projects → Teams → Departments
 *   → Users (non-GOD_MODE) → Invitations → ActionLogs → Company
 */
export async function deleteCompanyWithCascade(
  companyId: string | mongoose.Types.ObjectId
): Promise<Record<string, number>> {
  const cid = new mongoose.Types.ObjectId(companyId as string);

  // Collect IDs for nested entities (no direct company ref)
  const teamIds = await Team.find({ companyId: cid }).distinct("_id");
  const projectIds = await Project.find({ team: { $in: teamIds } }).distinct("_id");

  // Collect sprint IDs from tasks BEFORE deleting tasks (Sprint has no project/team ref)
  const sprintIds = await Task.find({
    project: { $in: projectIds },
    sprintId: { $exists: true, $ne: null },
  }).distinct("sprintId");

  // Delete in cascade order: leaves first, then parents
  const { deletedCount: stories } = await Story.deleteMany({ project: { $in: projectIds } });
  const { deletedCount: tasks } = await Task.deleteMany({ project: { $in: projectIds } });
  const { deletedCount: epics } = await Epic.deleteMany({ project: { $in: projectIds } });
  const { deletedCount: sprints } = await Sprint.deleteMany({ _id: { $in: sprintIds } });
  const { deletedCount: projects } = await Project.deleteMany({ team: { $in: teamIds } });
  const { deletedCount: teams } = await Team.deleteMany({ companyId: cid });
  const { deletedCount: departments } = await Department.deleteMany({ companyId: cid });

  // Delete company users (GOD_MODE users are global — never touch them)
  const { deletedCount: users } = await User.deleteMany({ companyId: cid, role: { $ne: "GOD_MODE" } });

  const { deletedCount: invitations } = await Invitation.deleteMany({ companyId: cid });
  const { deletedCount: actionLogs } = await ActionLog.deleteMany({ companyId: cid });

  await Company.findByIdAndDelete(cid);

  return {
    stories: stories ?? 0,
    tasks: tasks ?? 0,
    epics: epics ?? 0,
    sprints: sprints ?? 0,
    projects: projects ?? 0,
    teams: teams ?? 0,
    departments: departments ?? 0,
    users: users ?? 0,
    invitations: invitations ?? 0,
    actionLogs: actionLogs ?? 0,
    company: 1,
  };
}
