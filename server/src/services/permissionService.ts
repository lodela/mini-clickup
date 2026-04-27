/**
 * Permission Service — check if a user has permission for a module/action.
 * Queries the Role collection at runtime (not hardcoded).
 */
import Role, { RoleAction, RoleModule } from "../models/Role.js";
import User from "../models/User.js";

/** Returns true if the user's role grants the given action on the given module */
export async function can(
  userId: string,
  module: RoleModule,
  action: RoleAction
): Promise<boolean> {
  const user = await User.findById(userId).select("role").lean();
  if (!user) return false;

  const role = await Role.findOne({ name: user.role }).lean();
  if (!role) return false;

  const perm = role.permissions.find((p) => p.module === module);
  if (!perm) return false;

  return perm.actions.includes(action);
}
