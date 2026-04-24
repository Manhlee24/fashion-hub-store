import { AppDataSource } from "../data-source.js";
import { Order } from "../entities/Order.js";
import { OrderItem } from "../entities/OrderItem.js";
import { ProductVariant } from "../entities/ProductVariant.js";

const orderRepository = AppDataSource.getRepository(Order);

export const getAllOrders = async () => {
  const orders = await orderRepository.find({
    relations: ['user'],
    order: { created_at: 'DESC' }
  });
  return orders;
};

export const getUserOrders = async (userId: number) => {
  return await orderRepository.find({
    where: { user_id: userId },
    relations: ['user'],
    order: { created_at: 'DESC' }
  });
};

export const getOrderById = async (id: number | string) => {
  const order = await orderRepository.findOne({
    where: { id: Number(id) },
    relations: ['items', 'items.product', 'user']
  });

  if (!order) return null;

  // Map for frontend compatibility
  const orderData = { ...order };
  orderData.items = order.items.map((item: any) => ({
    ...item,
    product_name: item.product?.name || 'Unknown Product'
  }));

  return orderData;
};

export const createOrder = async (orderData: any, itemsData: any[]) => {
  return await AppDataSource.transaction(async (manager) => {
    // 1. Create the order
    const order = manager.create(Order, orderData);
    await manager.save(order);
    
    // 2. Process items and validate stock
    for (const item of itemsData) {
      if (!item.size) {
        throw new Error(`Sản phẩm ${item.product_id} yêu cầu chọn size`);
      }

      const variant = await manager.findOne(ProductVariant, {
        where: { product_id: item.product_id, size: item.size }
      });

      if (!variant) {
        throw new Error(`Size ${item.size} của sản phẩm không tồn tại`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Sản phẩm size ${item.size} chỉ còn ${variant.stock} trong kho`);
      }

      // Decrement stock
      variant.stock -= item.quantity;
      await manager.save(variant);
    }

    // 3. Create order items
    const items = itemsData.map(item => manager.create(OrderItem, {
      ...item,
      order_id: order.id
    }));
    
    await manager.save(OrderItem, items);
    
    return order;
  });
};

export const updateOrderStatus = async (id: number | string, status: string) => {
  const orderId = Number(id);
  const order = await orderRepository.findOneBy({ id: orderId });
  if (!order) return null;
  
  order.status = status;
  return await orderRepository.save(order);
};
