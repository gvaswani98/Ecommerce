import dotenv from 'dotenv';
dotenv.config();

const env = {
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.MONGO_URI,
	MONGO_DB_NAME: process.env.MONGO_DB_NAME,
	ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
	// REDIS_URL: process.env.REDIS_URL,
};

if (!env.MONGO_URI) throw new Error('❌ Missing required env: MONGO_URI');
if (!env.MONGO_DB_NAME)
	throw new Error('❌ Missing required env: MONGO_DB_NAME');
if (!env.ELASTICSEARCH_URL)
	throw new Error('❌ Missing required env: ELASTICSEARCH_URL');
// if (!env.REDIS_URL) throw new Error('❌ Missing required env: REDIS_URL');

export default env;
