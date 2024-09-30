export const checkIsAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(400).json({
                message: "Bạn không có quyền truy cập!"
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Bạn không có quyền truy cập!"
        })
    }
} 