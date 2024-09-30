import Order from '../models/Order.js';


// Lấy tất cả đơn hàng của người dùng
export const getOrder = async (req, res) => {
  try {
    // const userId = req.userId;
    // const sessionId = req.cookies.sessionId
    const orders = await Order.find()
    // .populate('user', 'userName')
    // .populate('products.product', 'title thumbnail price');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'products.product',
        select: 'colors image title',
      });

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    // Cập nhật trạng thái đơn hàng mà không kiểm tra trạng thái hiện tại
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

