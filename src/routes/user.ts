// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));

userRouter.put("/user/update-password", authMiddleware, userController.updatePassword.bind(userController));

export { userRouter };
