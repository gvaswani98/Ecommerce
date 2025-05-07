import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import connectToMongoDB from './config/mongoConfig.js';
import Product from './models/Product.js';
import elasticClient from './config/elasticsearch.js';
import { PRODUCT_INDEX } from './constants/elasticsearch.js';
import { createProductIndex } from './elasticsearch/createProductIndex.js';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Home', 'Beauty'];
const TENANTS = ['Amazon', 'Flipkart', 'Walmart', 'Target', 'eBay'];

const generateProduct = (_, index) => {
	const category = CATEGORIES[index % CATEGORIES.length];
	const tenant = TENANTS[index % TENANTS.length];
	const adjective = faker.commerce.productAdjective();
	const productType = faker.commerce.product();
	const name = `${adjective} ${category} ${productType}`;
	const description = `${adjective} ${category} sold by ${tenant}. Perfect for your needs.`;

	return {
		name,
		description,
		category,
		tenant,
		price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
		inStock: faker.datatype.boolean(),
	};
};

const seedProducts = async (count = 2500) => {
	try {
		await connectToMongoDB();
		console.log(`🔄 Seeding ${count} products...`);

		// MongoDB: delete + insert
		await Product.deleteMany();
		const fakeProducts = Array.from({ length: count }, (_, i) =>
			generateProduct(_, i)
		);
		await Product.insertMany(fakeProducts);
		console.log(`✅ Successfully seeded ${count} products to MongoDB`);

		// ElasticSearch: create index + bulk insert (fail-safe)
		try {
			await createProductIndex();

			const indexExists = await elasticClient.indices.exists({
				index: PRODUCT_INDEX,
			});
			if (indexExists) {
				await elasticClient.deleteByQuery({
					index: PRODUCT_INDEX,
					body: { query: { match_all: {} } },
				});
				console.log(
					`🧹 Cleared existing documents from ElasticSearch index: ${PRODUCT_INDEX}`
				);
			}

			const bulkOps = fakeProducts.flatMap((product) => [
				{ index: { _index: PRODUCT_INDEX } },
				{
					name: product.name,
					description: product.description,
				},
			]);

			const bulkResponse = await elasticClient.bulk({
				body: bulkOps,
				refresh: true,
			});

			if (bulkResponse.errors) {
				console.warn(
					'⚠️ Some documents failed to index in ElasticSearch.'
				);
			} else {
				console.log(
					`✅ Indexed ${fakeProducts.length} products into ElasticSearch`
				);
			}
		} catch (elasticError) {
			console.warn(`⚠️ ElasticSearch indexing skipped: ${elasticError}.`);

			console.warn('ℹ️ Autocomplete suggestions will be disabled.');
		}
	} catch (error) {
		console.error('❌ Seeding failed:', error.message);
	} finally {
		await mongoose.disconnect();
	}
};

seedProducts();
