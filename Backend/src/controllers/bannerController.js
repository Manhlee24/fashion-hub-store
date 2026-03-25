import db from '../config/db.js';

export const getBanners = async (req, res) => {
  try {
    const [banners] = await db.query('SELECT * FROM banners ORDER BY sort_order ASC');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBanner = async (req, res) => {
  const { image_url, is_active, sort_order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO banners (image_url, is_active, sort_order) VALUES (?, ?, ?)',
      [image_url, is_active, sort_order]
    );
    res.status(201).json({ id: result.insertId, image_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBanner = async (req, res) => {
  const { image_url, is_active, sort_order } = req.body;
  try {
    await db.query(
      'UPDATE banners SET image_url = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [image_url, is_active, sort_order, req.params.id]
    );
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await db.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
