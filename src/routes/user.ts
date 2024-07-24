import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers.bind(UserController));
userRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);

userRouter.put("/user/update-password", authMiddleware, userController.updatePassword.bind(userController));

export { userRouter };

