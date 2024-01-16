import express from "express";
import userController from "../controllers/user-controller.js";
import productController from "../controllers/product-controller.js";
import categoryController from "../controllers/category-controller.js";
import cartController from "../controllers/cart-controller.js";
import transactionController from "../controllers/transaction-controller.js";
import historyController from "../controllers/history-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// user api
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);
userRouter.put("/api/users/change-password", userController.update_password);

// product api
userRouter.post("/api/product", productController.create);
userRouter.get("/api/product", productController.search);
userRouter.put("/api/product/:productId", productController.update);
userRouter.delete("/api/product/:productId", productController.remove);
userRouter.get("/api/product/:productId", productController.get);

// category api
userRouter.get("/api/category", categoryController.list);
userRouter.get("/api/category/:categoryId", categoryController.get);

// cart api
userRouter.post("/api/cart", cartController.create);
userRouter.get("/api/cart/:userId", cartController.get);
userRouter.patch("/api/cart/:cartId", cartController.update);
userRouter.delete("/api/cart/:cartId", cartController.remove);

// transaction api
userRouter.post("/api/transaction", transactionController.create);
userRouter.get("/api/transaction/:transactionId", transactionController.check);

// history
userRouter.post("/api/history", historyController.create);
userRouter.get("/api/history/:userId", historyController.list);
userRouter.get("/api/history/:transactionId/transaction", historyController.get);
userRouter.put("/api/history", historyController.update);

export { userRouter };
