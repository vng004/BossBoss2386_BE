import { Router } from "express";
import {
  createCategory,
  editCategory,
  getCategory,
  getCategoryById,
  removeCategory,
} from "../controllers/categories.js";



const routeCategory = Router();

  routeCategory.get("/", getCategory),
  routeCategory.get("/:id", getCategoryById),
  routeCategory.post("/", createCategory),
  routeCategory.patch("/:id", editCategory),
  routeCategory.delete("/:id", removeCategory);
export default routeCategory;
