import db from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });
    
    const [items] = await db.query(
      'SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [req.params.id]
    );
    
    res.json({ ...orders[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  const { total_amount, items, receiver_name, phone, address } = req.body;
  const user_id = req.user.id;
  
  const connection = await db.getConnection();
  await connection.beginTransaction();
  
  try {
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status, receiver_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, total_amount, 'pending', receiver_name, phone, address]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.unit_price]
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
