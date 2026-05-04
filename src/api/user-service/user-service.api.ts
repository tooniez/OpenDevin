import { openHands } from "../open-hands-axios";
import { GitUser } from "#/types/git";

/**
 * User Service API - Handles all user-related API endpoints
 */
class UserService {
  /**
   * Get the current user's Git information
   * @returns Git user information
   */
  static async getUser(): Promise<GitUser> {
    const { data } = await openHands.get<GitUser>("/api/v1/users/git-info");
    return data;
  }
}

export default UserService;
