import client from '../config/elasticsearch.js';
import { PRODUCT_INDEX, productMapping } from '../constants/elasticsearch.js';

export async function createProductIndex() {
	const exists = await client.indices.exists({ index: PRODUCT_INDEX });
	if (!exists) {
		await client.indices.create({
			index: PRODUCT_INDEX,
			...productMapping,
		});
		console.log(`✅ Created Elasticsearch index: ${PRODUCT_INDEX}`);
	} else {
		console.log(`ℹ️ Index already exists: ${PRODUCT_INDEX}`);
	}
}
