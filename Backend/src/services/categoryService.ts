import { AppDataSource } from "../data-source.js";
import { Category } from "../entities/Category.js";

const categoryRepository = AppDataSource.getRepository(Category);

export const getAllCategories = async () => {
  return await categoryRepository.find();
};

export const getCategoryById = async (id: number | string) => {
  return await categoryRepository.findOneBy({ id: Number(id) });
};

export const createCategory = async (data: any) => {
  const category = categoryRepository.create(data);
  return await categoryRepository.save(category);
};

export const updateCategory = async (id: number | string, data: any) => {
  const categoryId = Number(id);
  const category = await categoryRepository.findOneBy({ id: categoryId });
  if (!category) return null;
  
  Object.assign(category, data);
  return await categoryRepository.save(category);
};

export const deleteCategory = async (id: number | string) => {
  const categoryId = Number(id);
  const category = await categoryRepository.findOneBy({ id: categoryId });
  if (!category) return null;
  
  return await categoryRepository.remove(category);
};
