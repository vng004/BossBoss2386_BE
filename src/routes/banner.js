import { Router } from 'express'
import { createBanner, getBanner, getBannerById, updateBanner } from '../controllers/banner.js'
const routeBanner = Router()

routeBanner.post('/', createBanner)
routeBanner.patch('/:id', updateBanner)
routeBanner.get('/', getBanner)
routeBanner.get('/:id', getBannerById)
export default routeBanner
