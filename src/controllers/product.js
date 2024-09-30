import Product from "../models/Product.js";
import slugify from "slugify";
import Brand from "../models/Brand.js";

export const getList = async (req, res, next) => {
  try {
    const { keyword = '', _page = 1, _limit = 10, _sort = 'createdAt', _order = 'asc' } = req.query;

    // Xây dựng truy vấn dựa trên từ khóa
    const query = keyword ? { title: { $regex: keyword, $options: 'i' } } : {};

    const options = {
      page: parseInt(_page),
      limit: parseInt(_limit),
      sort: { [_sort]: _order === 'asc' ? 1 : -1 },
      populate: {
        path: 'category',
        select: 'title',
      },
      populate: {
        path: "brand",
        select: "title"
      }
    };

    // Sử dụng phương thức paginate của mongoose
    const data = await Product.paginate(query, options);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công!',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lấy danh sách sản phẩm thất bại!',
      error: error.message,
    });
  }
};

// export const getProductsByCategory = async (req, res, next) => {
//   try {
//     const categoryId = req.params.id;
//     const data = await Product.find({ category: categoryId }).populate(
//       "category",
//       "title"
//     );
//     if (data) {
//       res.status(200).json({
//         success: true,
//         message: "Lấy danh sách sản phẩm theo danh mục thành công!",
//         data,
//       });
//     }
//   } catch (error) {
//     next({
//       status: 500,
//       success: false,
//       message: "Lấy danh sách sản phẩm theo danh mục thất bại!",
//       error: error.message,
//     });
//   }
// };


export const getProductById = async (req, res, next) => {
  try {
    const data = await Product.findById(req.params.id).populate(
      "brand",
      "title"
    );

    if (data) {
      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm thành công!",
        data,
      });
    }
  } catch (error) {
    next({
      status: 500,
      success: false,
      message: "Sản phẩm không tồn tại!",
      error: error.message,
    });
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const data = await Product.findOne({ slug: req.params.slug }).populate(
      "brand",
      "title"
    );

    if (data) {
      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm thành công!",
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại!",
      });
    }
  } catch (error) {
    next({
      status: 500,
      success: false,
      message: "Có lỗi xảy ra!",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const slug = slugify(req.body.title, {
      replacement: "-", // Chuyển dấu cách thành -
      lower: true, // Chuyển toàn bộ ký tự thành chữ thường
      strict: true, // Loại bỏ các ký tự không hợp lệ
      locale: true, // Hỗ trợ định dạng địa phương 
      trim: true // Loại bỏ các ký tự khoảng trắng ở đầu và cuối
    });
    const { colors, ...productData } = req.body;

    // Tính giá giảm cho từng màu sắc
    const colorsWithDiscount = colors.map(color => {
      const discountPrice = color.price - (color.price * (color.discountPercentage / 100));
      return {
        ...color,
        discountPrice // Cập nhật giá giảm cho từng màu sắc
      };
    });

    // Tạo sản phẩm mới với giá giảm đã tính toán cho từng màu sắc
    const data = await Product.create({
      ...productData,
      colors: colorsWithDiscount, slug
    });

    // Cập nhật danh mục để thêm sản phẩm mới tạo vào danh sách sản phẩm của danh mục đó
    const brandToUpdate = await Brand.findByIdAndUpdate(
      req.body.brand,
      {
        $push: { products: data._id },
      },
      { new: true }
    );


    if (data && brandToUpdate) {
      res.status(201).json({
        success: true,
        message: "Thêm mới sản phẩm thành công!",
        data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Thêm mới sản phẩm thất bại. Danh mục không được cập nhật.",
      });
    }
  } catch (error) {
    console.log(error);
    next({
      status: 500,
      success: false,
      message: "Thêm mới sản phẩm thất bại",
      error: error.message,
    });
  }
};


export const editProduct = async (req, res, next) => {
  try {
    const { title } = req.body;
    const updatedData = {
      ...req.body,
      slug: slugify(title, {
        replacement: "-",
        lower: true,
        strict: true,
        locale: 'vi', 
        trim: true
      })
    };
    const data = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (data) {
      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công!",
        data,
      });
    }
  } catch (error) {
    next({
      status: 500,
      success: false,
      message: "Cập nhật sản phẩm thất bại!",
      error: error.message,
    });
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);

    if (data) {
      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công!",
      });
    }
  } catch (error) {
    next({
      status: 500,
      success: false,
      message: "Xóa sản phẩm thất bại!",
      error: error.message,
    });
  }
};