import Banner from "../models/Banner.js"

export const createBanner = async (req, res, next) => {
    try {
        const existingBanner = await Banner.findOne();

        if (existingBanner) {
            return res.status(400).json({
                success: false,
                message: "Đã có một banner. Bạn chỉ có thể cập nhật banner hiện tại.",
            });
        }
        const data = await Banner.create(req.body)
        res.status(200).json(data)
    } catch (error) {
        next({
            message: 500,
            success: false,
            message: "Thêm mới ảnh không thành công!",
            error: error.message
        })
    }
}
export const getBanner = async (req, res, next) => {
    try {
        const data = await Banner.find(req.query)
        res.status(200).json(data)
    } catch (error) {
        next({
            message: 500,
            success: false,
            message: "Lấy ảnh không thành công!",
            error: error.message
        })
    }
}
export const getBannerById = async (req, res, next) => {
    try {
        const data = await Banner.findById(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        next({
            message: 500,
            success: false,
            message: "Lấy ảnh không thành công!",
            error: error.message
        })
    }
}
export const updateBanner = async (req, res, next) => {
    try {
        const data = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(data)
    } catch (error) {
        next({
            message: 500,
            success: false,
            message: "Cập nhật ảnh không thành công!",
            error: error.message
        })
    }
}