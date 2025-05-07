import axios from 'axios';

const productsApi = axios.create({
	baseURL: import.meta.env.VITE_SERVER_API,
	timeout: 10000,
});

export default productsApi;
