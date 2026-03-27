import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id, req.query.include_hidden === 'true');
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại hoặc đã bị ẩn' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    
    if (result.type === 'soft') {
      res.json({ 
        message: 'Sản phẩm đã có trong đơn hàng nên không thể xóa vĩnh viễn. Đã chuyển trạng thái sang "Ẩn".',
        is_soft_deleted: true 
      });
    } else {
      res.json({ message: 'Đã xóa sản phẩm vĩnh viễn' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
