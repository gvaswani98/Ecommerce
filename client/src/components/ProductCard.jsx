import React from 'react';
import clsx from 'clsx';
import '../styles/components/ProductCard.scss';

const ProductCard = ({ product, className }) => {
	return (
		<div className={clsx('product-card', className)}>
			<h3 className='name'>{product?.name || 'Unnamed Product'}</h3>
			<p className='description'>
				{product?.description || 'No description available.'}
			</p>
			<p className='price'>
				<span className='label'>Price:</span> $
				{product?.price?.toFixed(2) || '0.00'}
			</p>
			<p className='category'>
				<span className='label'>Category:</span>{' '}
				{product?.category || 'N/A'}
			</p>
			<p className='tenant'>
				<span className='label'>Tenant:</span>{' '}
				{product?.tenant || 'N/A'}
			</p>
		</div>
	);
};

export default ProductCard;
