import { AppDataSource } from "../data-source.js";
import { Product } from "../entities/Product.js";
import { ProductVariant } from "../entities/ProductVariant.js";
import { Category } from "../entities/Category.js";
import { Like, Between, FindOptionsOrder, FindOptionsWhere } from "typeorm";

const productRepository = AppDataSource.getRepository(Product);
const variantRepository = AppDataSource.getRepository(ProductVariant);

export const getAllProducts = async (options: any = {}) => {
  const { include_hidden, is_featured, category_id, search, min_price, max_price, sort } = options;
  
  const where: FindOptionsWhere<Product> = {};
  
  if (include_hidden !== 'true' && include_hidden !== true) {
    where.status = 'active';
  }
  
  if (is_featured !== undefined) {
    where.is_featured = is_featured === 'true' || is_featured === true;
  }
  
  if (category_id) {
    where.category_id = Number(category_id);
  }
  
  if (search) {
    where.name = Like(`%${search}%`);
  }
  
  if (min_price || max_price) {
    where.price = Between(
      Number(min_price) || 0,
      Number(max_price) || 999999999
    );
  }

  let order: FindOptionsOrder<Product> = { created_at: 'DESC' };
  if (sort === 'price_asc') order = { price: 'ASC' };
  if (sort === 'price_desc') order = { price: 'DESC' };
  if (sort === 'newest') order = { created_at: 'DESC' };

  return await productRepository.find({
    where,
    relations: ['category', 'variants'],
    order
  });
};

export const getProductById = async (id: number | string, include_hidden = false) => {
  const where: FindOptionsWhere<Product> = { id: Number(id) };
  if (!include_hidden) {
    where.status = 'active';
  }
  
  return await productRepository.findOne({
    where,
    relations: ['category', 'variants']
  });
};

export const createProduct = async (data: any) => {
  const { variants, ...productData } = data;
  
  return await AppDataSource.transaction(async (manager) => {
    const product = manager.create(Product, productData);
    await manager.save(product);
    
    if (variants && Array.isArray(variants)) {
      const variantEntities = variants.map(v => manager.create(ProductVariant, { 
        ...v, 
        product_id: product.id 
      }));
      await manager.save(ProductVariant, variantEntities);
    }
    
    // Fetch complete product with relations
    return await manager.findOne(Product, {
      where: { id: product.id },
      relations: ['category', 'variants']
    });
  });
};

export const updateProduct = async (id: number | string, data: any) => {
  const { variants, ...productData } = data;
  const productId = Number(id);
  
  const product = await productRepository.findOneBy({ id: productId });
  if (!product) return null;

  return await AppDataSource.transaction(async (manager) => {
    await manager.update(Product, productId, productData);

    if (variants && Array.isArray(variants)) {
      // Simple sync: delete all and recreate
      await manager.delete(ProductVariant, { product_id: productId });
      const variantEntities = variants.map(v => manager.create(ProductVariant, { 
        ...v, 
        product_id: productId 
      }));
      await manager.save(ProductVariant, variantEntities);
    }

    return await manager.findOne(Product, {
      where: { id: productId },
      relations: ['category', 'variants']
    });
  });
};

export const deleteProduct = async (id: number | string) => {
  const productId = Number(id);
  const product = await productRepository.findOneBy({ id: productId });
  if (!product) return null;
  
  return await AppDataSource.transaction(async (manager) => {
    try {
      // Delete variants first
      await manager.delete(ProductVariant, { product_id: productId });
      // Try hard delete product
      await manager.remove(product);
      return { type: 'hard' };
    } catch (error: any) {
      // If foreign key constraint (e.g. orders exist), soft delete
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.message.includes('foreign key')) {
        await manager.update(Product, productId, { status: 'hidden' });
        return { type: 'soft' };
      }
      throw error;
    }
  });
};
