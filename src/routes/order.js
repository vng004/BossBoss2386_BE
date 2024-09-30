import { Router } from "express";
import { getOrder, getOrderById, updateOrderStatus } from "../controllers/order.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const routeOrder = Router();



routeOrder.get("/", getOrder);
routeOrder.get("/:id", getOrderById);
routeOrder.patch("/:id/status", updateOrderStatus);

export default routeOrder;
