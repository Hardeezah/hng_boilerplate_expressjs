// src/services/UserService.ts
import { User } from "../models/user";
import { IUserService } from "../types";
import { comparePassword, hashPassword } from "../utils";

export class UserService implements IUserService {
  public async getUserById(id: string): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
      relations: ["profile", "products", "organizations"],
    });
    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await User.find({
      relations: ["profile", "products", "organizations"],
    });
    return users;
  }

  public async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean, status_code: number, message: string }> {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return { success: false, status_code: 404, message: "User not found" };
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, status_code: 400, message: "Current password is incorrect" };
    }

    if (!newPassword) {
      return { success: false, status_code: 400, message: "New password cannot be empty" };
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { success: true, status_code: 200, message: "Password updated successfully" };
  }

}
