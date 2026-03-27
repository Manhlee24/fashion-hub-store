import { Product, Category } from '../models/associations.js';
import { Op } from 'sequelize';

export const getAllProducts = async (options = {}) => {
  const { include_hidden, is_featured, category_id, search } = options;
  
  const where = {};
  if (include_hidden !== 'true' && include_hidden !== true) where.status = 'active';
  if (is_featured !== undefined) where.is_featured = is_featured === 'true' || is_featured === true;
  if (category_id) where.category_id = category_id;
  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  return await Product.findAll({
    where,
    include: [{ model: Category, as: 'category' }],
    order: [['created_at', 'DESC']]
  });
};

export const getProductById = async (id, include_hidden = false) => {
  const where = { id };
  if (!include_hidden) where.status = 'active';
  
  return await Product.findOne({
    where,
    include: [{ model: Category, as: 'category' }]
  });
};

export const createProduct = async (data) => {
  return await Product.create(data);
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  return await product.update(data);
};

export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  
  try {
    // Try hard delete
    await product.destroy();
    return { type: 'hard' };
  } catch (error) {
    // If foreign key constraint, soft delete
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      await product.update({ status: 'hidden' });
      return { type: 'soft' };
    }
    throw error;
  }
};
