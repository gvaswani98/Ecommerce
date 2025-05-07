import { HTTP_STATUS } from '../constants/common.js';

export class BadRequestError extends Error {
	constructor(message) {
		super(message);
		this.name = 'BadRequestError';
		this.statusCode = HTTP_STATUS.BAD_REQUEST;
	}
}

export class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NotFoundError';
		this.statusCode = HTTP_STATUS.NOT_FOUND;
	}
}

export class InternalServerError extends Error {
	constructor(message = 'Internal server error') {
		super(message);
		this.name = 'InternalServerError';
		this.statusCode = HTTP_STATUS.INTERNAL_ERROR;
	}
}

// Add more classes as needed (e.g., UnauthorizedError)
