import { Router } from "express";
import { createProduct, editProduct, getList, getProductById, getProductBySlug, removeProduct } from "../controllers/product.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import productSchema from "../validation/productSchema.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkIsAdmin } from "../middlewares/checkIsAdmin.js";

const routeProduct = Router()

    routeProduct.get("/search", getList),
    routeProduct.get("/", getList),
    routeProduct.get("/:id", getProductById),
    routeProduct.get('/slug/:slug', getProductBySlug);


    // routeProduct.use("/", checkAuth, checkIsAdmin)

    routeProduct.delete("/:id", removeProduct),
    routeProduct.post("/", createProduct),
    routeProduct.patch("/:id", editProduct)

export default routeProduct