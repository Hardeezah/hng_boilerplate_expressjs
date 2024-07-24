// src/controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { current_password, new_password } = req.body;
      const userId = req.user?.id;

      if (!current_password || !new_password) {
        return res.status(400).json({
          status: "unsuccessful",
          status_code: 400,
          message: "Current password and new password must be provided."
        });
      }

      const result = await this.userService.updatePassword(userId, current_password, new_password);
      if (!result.success) {
        return res.status(result.status_code).json({
          status: "unsuccessful",
          status_code: result.status_code,
          message: result.message
        });
      }

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Password updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }}

export default UserController;
