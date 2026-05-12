import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { categories, products, users, reviews } from './data.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0];

    const createdCategories = await Category.create(categories);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
      categoryMap[cat.slug] = cat._id;
    });

    const productsWithCategory = products.map(p => {
      const categoryId = categoryMap[p.category];
      if (!categoryId) {
        throw new Error(`Unknown category "${p.category}" for product "${p.name}"`);
      }

      return {
        ...p,
        category: categoryId,
      };
    });

    const createdProducts = await Product.create(productsWithCategory);

    const reviewData = [];
    for (const product of createdProducts.slice(0, 5)) {
      for (let i = 0; i < createdUsers.length; i += 1) {
        const review = reviews[i % reviews.length];
        reviewData.push({
          ...review,
          user: createdUsers[i]._id,
          product: product._id,
        });
      }
    }
    await Review.create(reviewData);

    console.log('Seed data imported successfully');
    console.log(`  - ${createdUsers.length} users`);
    console.log(`  - ${createdCategories.length} categories`);
    console.log(`  - ${createdProducts.length} products`);
    console.log(`  - ${reviewData.length} reviews`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
