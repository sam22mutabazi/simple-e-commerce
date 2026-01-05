import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';

// @desc    Get all unique categories with product counts
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
    { $sort: { name: 1 } },
  ]);
  res.json(categories);
});

// @desc    Fetch all products (Paginated for Home Screen)
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 9; 
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  const category = req.query.category && req.query.category !== 'all' ? { category: req.query.category } : {};

  const mongoQuery = { ...keyword, ...category };
  const count = await Product.countDocuments(mongoQuery);
  const products = await Product.find(mongoQuery)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get all products for Admin (NO PAGINATION)
export const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get products with low stock
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ countInStock: { $lte: 5 } });
  res.json(products);
});

// @desc    Fetch single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else { res.status(404); throw new Error('Product not found'); }
});

// @desc    Create a product (Admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg', 
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock ?? product.countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else { res.status(404); throw new Error('Product not found'); }
});

// @desc    Delete a product (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else { res.status(404); throw new Error('Product not found'); }
});

// @desc    Create new review
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }
    const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else { res.status(404); throw new Error('Product not found'); }
});