import express from "express";
import { Add, Delete, Edit, Get } from "../../controllers/TransactionController/Transaction.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const TransactionRouter = express.Router();

TransactionRouter.post("/Transaction/add",authMiddleware, Add);
TransactionRouter.get("/Transaction/get",authMiddleware, Get);
TransactionRouter.put("/Transaction/edit/:id",authMiddleware, Edit);
TransactionRouter.delete("/Transaction/delete/:id",authMiddleware, Delete);

export default TransactionRouter;