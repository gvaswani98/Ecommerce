import mongoose from 'mongoose';
import { COLLECTIONS } from '../constants/common.js';

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		tenant: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		inStock: {
			type: Boolean,
			default: true,
		},
		// TODO: Add image URLs, ratings, tags, etc. when expanding the platform
	},
	{
		timestamps: true,
	}
);

// Compound index for efficient filtering
ProductSchema.index({ category: 1, tenant: 1 });

// Text index for full-text search
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', ProductSchema, COLLECTIONS.PRODUCTS);
