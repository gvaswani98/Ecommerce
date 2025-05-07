import Product from '../models/Product.js';
import { validationMethods } from '../helpers/validations.js';
import { BadRequestError, InternalServerError } from '../helpers/errors.js';
import {
	SORT_ORDERS,
	DEFAULT_PAGE_LIMIT,
	DEFAULT_SORT,
	TEXT_SCORE_SORT_FIELD,
} from '../constants/common.js';
import elasticClient from '../config/elasticsearch.js';
import { PRODUCT_INDEX } from '../constants/elasticsearch.js';

const addProduct = async (productData) => {
	try {
		let name, description, category, tenant, price, inStock;

		try {
			name = validationMethods.isValidString(
				productData.name,
				'Product name'
			);
			description = productData.description
				? validationMethods.isValidString(
						productData.description,
						'Description'
				  )
				: '';
			category = validationMethods.isValidString(
				productData.category,
				'Category'
			);
			tenant = validationMethods.isValidString(
				productData.tenant,
				'Tenant'
			);
			price = Number(
				validationMethods.isValidNumber(
					Number(productData.price),
					'Price'
				)
			);
			inStock =
				productData.inStock !== undefined
					? Boolean(productData.inStock)
					: true;
		} catch (validationError) {
			throw new BadRequestError(validationError.message);
		}

		const newProduct = new Product({
			name,
			description,
			category,
			tenant,
			price,
			inStock,
		});

		const savedProduct = await newProduct.save();
		return savedProduct;
	} catch (error) {
		if (error instanceof BadRequestError) throw error;
		throw new InternalServerError('Failed to add new product');
	}
};

const getProducts = async (queryParams) => {
	try {
		let { category, tenant, page, limit, sortBy, order } = queryParams;

		page = page || 1;
		limit = limit || DEFAULT_PAGE_LIMIT;
		sortBy = sortBy || DEFAULT_SORT.BY;
		order = order || DEFAULT_SORT.ORDER;

		try {
			if (category)
				category = validationMethods.isValidString(
					category,
					'Category'
				);
			if (tenant)
				tenant = validationMethods.isValidString(tenant, 'Tenant');
			if (sortBy)
				sortBy = validationMethods.isValidSortField(sortBy, 'Sort By');
			page =
				validationMethods.isValidWholeNumber(Number(page), 'Page') || 1;
			limit =
				validationMethods.isValidWholeNumber(Number(limit), 'Limit') ||
				DEFAULT_PAGE_LIMIT;
		} catch (validationError) {
			throw new BadRequestError(validationError.message);
		}

		const filters = {};
		if (category) filters.category = category;
		if (tenant) filters.tenant = tenant;

		const sortOrder = order === SORT_ORDERS.ASC ? 1 : -1;
		const skip = (page - 1) * limit;

		const [results, total] = await Promise.all([
			Product.find(filters)
				.collation({ locale: 'en', strength: 2 })
				.sort({ [sortBy]: sortOrder })
				.skip(skip)
				.limit(limit)
				.lean(),
			Product.countDocuments(filters),
		]);

		return {
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
			results,
		};
	} catch (error) {
		if (error instanceof BadRequestError) throw error;
		throw new InternalServerError('Database error during product listing');
	}
};

const searchProducts = async (queryParams) => {
	try {
		let { q, category, tenant, page, limit, sortBy, order } = queryParams;

		page = page || 1;
		limit = limit || DEFAULT_PAGE_LIMIT;
		sortBy = sortBy || DEFAULT_SORT.BY;
		order = order || DEFAULT_SORT.ORDER;

		try {
			if (!q) throw new BadRequestError('Search query (q) is required');

			q = validationMethods.isValidString(q, 'Search Term');
			if (category)
				category = validationMethods.isValidString(
					category,
					'Category'
				);
			if (tenant)
				tenant = validationMethods.isValidString(tenant, 'Tenant');
			if (sortBy)
				sortBy = validationMethods.isValidSortField(sortBy, 'Sort By');
			page =
				validationMethods.isValidWholeNumber(Number(page), 'Page') || 1;
			limit =
				validationMethods.isValidWholeNumber(Number(limit), 'Limit') ||
				DEFAULT_PAGE_LIMIT;
		} catch (validationError) {
			throw new BadRequestError(validationError.message);
		}
		const regex = new RegExp(q.trim().split(/\s+/).join('.*'), 'i');
		const filters = {
			$or: [
				{ name: { $regex: regex } },
				{ description: { $regex: regex } },
			],
		};
		if (category) filters.category = category;
		if (tenant) filters.tenant = tenant;

		const skip = (page - 1) * limit;
		const sortOrder = order === SORT_ORDERS.ASC ? 1 : -1;

		const query = Product.find(filters)
			.collation({ locale: 'en', strength: 2 })
			.sort({ [sortBy]: sortOrder })
			.skip(skip)
			.limit(limit)
			.lean();

		const [results, total] = await Promise.all([
			query,
			Product.countDocuments(filters),
		]);

		return {
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
			results,
		};
	} catch (error) {
		if (error instanceof BadRequestError) throw error;
		throw new InternalServerError('Database error during product search');
	}
};

const getSuggestions = async (query) => {
	try {
		let q;

		try {
			q = validationMethods.isValidString(query, 'Suggestion Query');
		} catch (validationError) {
			throw new BadRequestError(validationError.message);
		}

		const esResponse = await elasticClient.search({
			index: PRODUCT_INDEX,
			size: 10,
			query: {
				bool: {
					should: [
						{ match_phrase_prefix: { name: q } },
						{ match_phrase_prefix: { description: q } },
					],
				},
			},
			_source: ['name'],
		});

		const suggestions = esResponse.hits.hits.map((hit) => hit._source.name);
		return [...new Set(suggestions)];
	} catch (error) {
		if (error instanceof BadRequestError) throw error;
		throw new InternalServerError('ElasticSearch suggestion query failed');
	}
};

export default {
	addProduct,
	getProducts,
	searchProducts,
	getSuggestions,
};
