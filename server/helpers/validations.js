import mongoose from 'mongoose';
import { SORT_FIELDS } from '../constants/common.js';

const isValidObjectId = (id, paramName = 'ID') => {
	id = isValidString(id, paramName);
	if (!mongoose.Types.ObjectId.isValid(id))
		throw new Error(`Invalid ${paramName}`);
	return id;
};

const isValidBoolean = (bool, paramName = 'Parameter') => {
	if (typeof bool !== 'boolean') {
		throw new Error(`${paramName} must be a boolean value`);
	}
};

const isValidString = (
	str,
	paramName = 'String param',
	returnTrimValue = true
) => {
	if (!str) throw new Error(`You must provide a ${paramName}`);
	if (typeof str !== 'string')
		throw new Error(`${paramName} should be of type string`);
	if (!str.trim())
		throw new Error(
			`${paramName} cannot be an empty string or just spaces`
		);
	return returnTrimValue ? str.trim() : str;
};

const isValidNumber = (num, paramName = 'Number', throwError = true) => {
	const isValid = typeof num === 'number' && !isNaN(num);
	if (throwError && !isValid)
		throw new Error(`${paramName} should be a valid number`);
	return isValid;
};

const isValidWholeNumber = (num, paramName = 'Number', throwError = true) => {
	if (!isValidNumber(num, paramName, throwError)) return null;
	if (!Number.isInteger(num) || num < 0) {
		if (throwError)
			throw new Error(`${paramName} should be a whole number`);
		return null;
	}
	return num;
};

const isValidArray = (arr, paramName = 'Array') => {
	if (!arr) throw new Error(`You must provide ${paramName}`);
	if (!Array.isArray(arr)) throw new Error(`${paramName} should be an array`);
	if (!arr.length)
		throw new Error(`${paramName} must have at least one value`);
};

const isValidObject = (obj, paramName = 'Object', checkKeyLength = true) => {
	if (!obj) throw new Error(`You must provide a ${paramName}`);
	if (typeof obj !== 'object' || Array.isArray(obj)) {
		throw new Error(`${paramName} must be a plain object`);
	}
	if (checkKeyLength && Object.keys(obj).length === 0) {
		throw new Error(`${paramName} cannot be an empty object`);
	}
};

const isValidDate = (dateString, paramName = 'Date') => {
	dateString = isValidString(dateString, paramName);
	const parsedDate = new Date(dateString);
	const isValid = !isNaN(parsedDate.getTime());

	if (!isValid) throw new Error(`${paramName} is not a valid date`);
	if (parsedDate > new Date())
		throw new Error(`${paramName} cannot be in the future`);

	return dateString;
};

const isValidSortField = (field, label = 'Sort Field') => {
	if (!SORT_FIELDS.includes(field)) {
		throw new Error(`${label} must be one of: ${SORT_FIELDS.join(', ')}`);
	}
	return field;
};

const validationMethods = {
	isValidObjectId,
	isValidBoolean,
	isValidString,
	isValidNumber,
	isValidWholeNumber,
	isValidArray,
	isValidObject,
	isValidDate,
	isValidSortField,
};

export { validationMethods };
