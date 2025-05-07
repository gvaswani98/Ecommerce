import { Client } from '@elastic/elasticsearch';
import env from './envConfig.js';

const client = new Client({
	node: env.ELASTICSEARCH_URL || 'http://localhost:9200',
	maxRetries: 5,
	requestTimeout: 10000,
});

export default client;
