import productsApi from '../api/productsApi.js';
import API_ROUTES from '../constants/apiRoutes.js';

const extractErrorMessage = (error, fallbackMessage) => {
	const backendError = error?.response?.data?.error;
	const status = error?.response?.status;

	console.error(
		`[API Error ${status || 'Unknown'}]: ${backendError || error.message}`
	);

	return backendError || fallbackMessage;
};

const searchProducts = async (params) => {
	try {
		const response = await productsApi.get(API_ROUTES.PRODUCT.SEARCH, {
			params,
		});
		return { success: true, data: response.data };
	} catch (error) {
		return {
			success: false,
			error: extractErrorMessage(
				error,
				'Failed to perform product search. Please try again.'
			),
		};
	}
};

const getPaginatedProducts = async (params) => {
	try {
		const response = await productsApi.get(API_ROUTES.PRODUCT.LIST, {
			params,
		});
		return { success: true, data: response.data };
	} catch (error) {
		return {
			success: false,
			error: extractErrorMessage(
				error,
				'Failed to fetch products. Please try again.'
			),
		};
	}
};

const getSuggestions = async (params) => {
	try {
		const response = await productsApi.get(API_ROUTES.PRODUCT.SUGGESTIONS, {
			params,
		});
		return { success: true, data: response.data.suggestions || [] };
	} catch (error) {
		return {
			success: false,
			error: extractErrorMessage(
				error,
				'Failed to fetch autocomplete suggestions.'
			),
		};
	}
};

export default {
	searchProducts,
	getPaginatedProducts,
	getSuggestions,
};
