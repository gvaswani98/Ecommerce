import express from 'express';
import { productFunctions } from '../data/index.js';
import { validationMethods } from '../helpers/validations.js';
import { BadRequestError } from '../helpers/errors.js';
import { HTTP_STATUS, DEFAULT_PAGE_LIMIT } from '../constants/common.js';
import elasticClient from '../config/elasticsearch.js';
import { PRODUCT_INDEX } from '../constants/elasticsearch.js';

const router = express.Router();

// GET /products: Paginated product listing with optional filters
// POST /products: Add a new product
router
	.route('/')
	.get(async (request, response) => {
		try {
			let { category, tenant, page, limit, sortBy, order } =
				request.query;
			try {
				if (category)
					category = validationMethods.isValidString(
						category,
						'Category'
					);
				if (tenant)
					tenant = validationMethods.isValidString(tenant, 'Tenant');
				if (page) {
					page =
						validationMethods.isValidWholeNumber(
							Number(page),
							'Page'
						) || 1;
				}
				if (limit) {
					limit =
						validationMethods.isValidWholeNumber(
							Number(limit),
							'Limit'
						) || DEFAULT_PAGE_LIMIT;
				}
				if (sortBy)
					sortBy = validationMethods.isValidSortField(
						sortBy,
						'Sort By'
					);
			} catch (validationError) {
				return response
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ error: validationError.message });
			}

			const result = await productFunctions.getProducts({
				category,
				tenant,
				page,
				limit,
				sortBy,
				order,
			});

			response.status(HTTP_STATUS.OK).json(result);
		} catch (error) {
			console.error('Product listing error:', error);
			const status = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
			response.status(status).json({ error: error.message });
		}
	})
	.post(async (request, response) => {
		try {
			let validatedData = {};
			try {
				validatedData.name = validationMethods.isValidString(
					request.body.name,
					'Product name'
				);
				validatedData.description = request.body.description
					? validationMethods.isValidString(
							request.body.description,
							'Description'
					  )
					: '';
				validatedData.category = validationMethods.isValidString(
					request.body.category,
					'Category'
				);
				validatedData.tenant = validationMethods.isValidString(
					request.body.tenant,
					'Tenant'
				);
				validatedData.price = Number(
					validationMethods.isValidNumber(
						Number(request.body.price),
						'Price'
					)
				);
				validatedData.inStock =
					request.body.inStock !== undefined
						? Boolean(request.body.inStock)
						: true;
			} catch (validationError) {
				throw new BadRequestError(validationError.message);
			}

			const newProduct = await productFunctions.addProduct(validatedData);
			return response.status(HTTP_STATUS.CREATED).json(newProduct);
		} catch (error) {
			console.error(`Error in ${request.originalUrl}: ${error.message}`);
			const statusCode = error.statusCode || 500;
			return response.status(statusCode).json({ error: error.message });
		}
	});

// GET /products/search: Full-text search with optional filters
router.route('/search').get(async (request, response) => {
	try {
		const { category, tenant, q, page, limit, sortBy, order } =
			request.query;
		const validatedQuery = {};

		try {
			if (!q) throw new BadRequestError('Search query (q) is required');
			validatedQuery.q = validationMethods.isValidString(
				q,
				'Search text'
			);
			if (category)
				validatedQuery.category = validationMethods.isValidString(
					category,
					'Category'
				);
			if (tenant)
				validatedQuery.tenant = validationMethods.isValidString(
					tenant,
					'Tenant'
				);
			if (page)
				validatedQuery.page =
					validationMethods.isValidWholeNumber(
						Number(page),
						'Page'
					) || 1;
			if (limit)
				validatedQuery.limit =
					validationMethods.isValidWholeNumber(
						Number(limit),
						'Limit'
					) || DEFAULT_PAGE_LIMIT;
			if (sortBy)
				validatedQuery.sortBy = validationMethods.isValidSortField(
					sortBy,
					'Sort By'
				);
			if (order) validatedQuery.order = order;
		} catch (validationError) {
			return response
				.status(HTTP_STATUS.BAD_REQUEST)
				.json({ error: validationError.message });
		}

		const searchResults = await productFunctions.searchProducts(
			validatedQuery
		);
		return response.status(HTTP_STATUS.OK).json(searchResults);
	} catch (error) {
		console.error(`Error in ${request.originalUrl}: ${error.message}`);
		const statusCode = error.status || 500;
		return response.status(statusCode).json({ error: error.message });
	}
});

// GET /products/suggestions: Get autocomplete suggestions
router.get('/suggestions', async (request, response) => {
	try {
		const { q } = request.query;

		const validatedQuery = {};
		try {
			validatedQuery.q = validationMethods.isValidString(q, 'Query');
		} catch (validationError) {
			return response
				.status(HTTP_STATUS.BAD_REQUEST)
				.json({ error: validationError.message });
		}

		const suggestions = await productFunctions.getSuggestions(
			validatedQuery.q
		);
		return response.status(HTTP_STATUS.OK).json({ suggestions });
	} catch (error) {
		console.error(`Error in ${request.originalUrl}: ${error.message}`);
		const statusCode = error.status || 500;
		return response.status(statusCode).json({ error: error.message });
	}
});

export default router;
