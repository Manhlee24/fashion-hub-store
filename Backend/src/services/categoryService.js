import { Category } from '../models/associations.js';

export const getAllCategories = async () => {
  return await Category.findAll();
};

export const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

export const createCategory = async (data) => {
  return await Category.create(data);
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  return await category.update(data);
};

export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  return await category.destroy();
};
