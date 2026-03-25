import db from '../config/db.js';

export const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
