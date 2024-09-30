import { Router } from "express";
import { addToCart, checkout, getCart, removeFromCart, updateQuantity } from "../controllers/cart.js";

const routeCart = Router();

routeCart.get("/", getCart);
routeCart.post("/", addToCart);
routeCart.post("/checkout/:id", checkout);
routeCart.patch("/:productId", updateQuantity);
routeCart.delete("/:productId", removeFromCart);

export default routeCart;
