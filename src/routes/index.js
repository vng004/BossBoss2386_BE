import routeBanner from "./banner.js";
import routeBrand from "./brand.js";
import routeCart from "./cart.js";
import routeCategory from "./categories.js";
import routeOrder from "./order.js";
import routeProduct from "./product.js";

export function router(app) {
    app.use("/api/products", routeProduct)
    app.use("/api/categories", routeCategory)
    app.use("/api/cart", routeCart)
    app.use("/api/orders", routeOrder)
    app.use("/api/banners", routeBanner)
    app.use("/api/brands", routeBrand)
}