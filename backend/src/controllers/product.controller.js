const Product = require("../models/Product");
const slugify = require("../utils/slugify");

/**
 * PUBLIC: List products
 * GET /api/products?search=&active=&sort=
 */
const listProducts = async (req, res) => {
  try {
    const { search, active, sort } = req.query;

    const filter = {};
    if (active === "true") filter.active = true;
    if (active === "false") filter.active = false;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    let query = Product.find(filter).select(
      "title slug priceUSD stockQty active images createdAt"
    );

    if (sort === "newest") query = query.sort({ createdAt: -1 });
    if (sort === "price_asc") query = query.sort({ priceUSD: 1 });
    if (sort === "price_desc") query = query.sort({ priceUSD: -1 });

    const products = await query.limit(50);
    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Get product by slug
 * GET /api/products/:slug
 */
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug: slug.toLowerCase() });
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Get product by id
 * GET /api/admin/products/:id
 */
const getProductByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Create product (slug auto-generated from title)
 * POST /api/admin/products
 */
const createProduct = async (req, res) => {
  try {
    const { title, description, priceUSD, stockQty, active, images } = req.body;

    if (!title || priceUSD === undefined) {
      return res.status(400).json({ message: "title and priceUSD required" });
    }

    const baseSlug = slugify(title);
    if (!baseSlug) {
      return res
        .status(400)
        .json({ message: "Invalid title (cannot create slug)" });
    }

    // Ensure unique slug: if exists, append -2, -3, ...
    let uniqueSlug = baseSlug;
    let counter = 2;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const product = await Product.create({
      title,
      slug: uniqueSlug,
      description: description || "",
      priceUSD: Number(priceUSD),
      stockQty: stockQty === undefined ? 0 : Number(stockQty),
      active: active === undefined ? true : Boolean(active),
      images: Array.isArray(images) ? images : [],
    });

    return res.status(201).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Update product
 * PATCH /api/admin/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };
    if (updates.slug) updates.slug = String(updates.slug).toLowerCase();
    if (updates.priceUSD !== undefined) updates.priceUSD = Number(updates.priceUSD);
    if (updates.stockQty !== undefined) updates.stockQty = Number(updates.stockQty);

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Delete product
 * DELETE /api/admin/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listProducts,
  getProductBySlug,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
