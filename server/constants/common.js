const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
};

const COLLECTIONS = {
	PRODUCTS: 'products',
	USERS: 'users',
	ORDERS: 'orders',
};

const ROLES = {
	ADMIN: 'admin',
	USER: 'user',
};

const DEFAULT_PAGE_LIMIT = 10;

const SORT_ORDERS = {
	ASC: 'asc',
	DESC: 'desc',
};

const DEFAULT_SORT = {
	BY: 'createdAt',
	ORDER: SORT_ORDERS.DESC,
};

const SORT_FIELDS = ['price', 'name', 'createdAt', 'score'];

const TEXT_SCORE_SORT_FIELD = 'score';

export {
	HTTP_STATUS,
	COLLECTIONS,
	ROLES,
	SORT_ORDERS,
	DEFAULT_PAGE_LIMIT,
	DEFAULT_SORT,
	SORT_FIELDS,
	TEXT_SCORE_SORT_FIELD,
};
