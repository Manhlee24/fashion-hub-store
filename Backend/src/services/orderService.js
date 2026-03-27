import { Order, OrderItem, Product, User } from '../models/associations.js';
import sequelize from '../models/index.js';

export const getAllOrders = async () => {
  return await Order.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    order: [['created_at', 'DESC']]
  });
};

export const getUserOrders = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

export const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name'] }]
      },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ]
  });

  if (!order) return null;

  // Map for frontend compatibility (e.g., item.product_name)
  const orderJSON = order.toJSON();
  orderJSON.items = orderJSON.items.map(item => ({
    ...item,
    product_name: item.product?.name || 'Unknown Product'
  }));

  return orderJSON;
};

export const createOrder = async (orderData, itemsData) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.create(orderData, { transaction });
    
    const items = itemsData.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    await OrderItem.bulkCreate(items, { transaction });
    
    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByPk(id);
  if (!order) return null;
  return await order.update({ status });
};
