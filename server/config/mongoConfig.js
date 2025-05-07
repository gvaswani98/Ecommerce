import mongoose from 'mongoose';
import env from './envConfig.js';

const connectToMongoDB = async () => {
	try {
		const connection = await mongoose.connect(env.MONGO_URI, {
			dbName: env.MONGO_DB_NAME,
		});
		console.log(
			`✅ MongoDB connected to DB: ${env.MONGO_DB_NAME} @ ${connection.connection.host}`
		);
	} catch (error) {
		console.error('❌ Failed to connect to MongoDB:', error.message);
		process.exit(1);
	}
};

export default connectToMongoDB;
