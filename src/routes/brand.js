import { Router } from "express";
import { createBrand, editBrand, getBrand, getBrandById, removeBrand } from "../controllers/brand.js";
const routeBrand = Router()

routeBrand.get('/', getBrand)
routeBrand.get('/:id', getBrandById)
routeBrand.post('/', createBrand)
routeBrand.patch('/:id', editBrand)
routeBrand.delete('/:id',removeBrand)

export default routeBrand