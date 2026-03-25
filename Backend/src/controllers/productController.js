import db from '../config/db.js';

export const getProducts = async (req, res) => {
  const { category_id, is_featured } = req.query;
  try {
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    let params = [];
    let conditions = [];

    if (category_id) {
      conditions.push('p.category_id = ?');
      params.push(category_id);
    }
    if (is_featured !== undefined) {
      conditions.push('p.is_featured = ?');
      params.push(is_featured === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description, image_url, category_id, is_featured } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, description, image_url, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, description, image_url, category_id, is_featured]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price, description, image_url, category_id, is_featured } = req.body;
  try {
    await db.query(
      'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category_id = ?, is_featured = ? WHERE id = ?',
      [name, price, description, image_url, category_id, is_featured, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
