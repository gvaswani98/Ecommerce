import React from 'react';
import clsx from 'clsx';
import '../../styles/components/common/Select.scss';

const Pagination = ({ page = 1, totalPages = 1, onPageChange, className }) => {
	if (totalPages <= 1) return null;

	const handlePrev = () => {
		if (page > 1) onPageChange(page - 1);
	};

	const handleNext = () => {
		if (page < totalPages) onPageChange(page + 1);
	};

	return (
		<div className={clsx('pagination', className)}>
			<button
				onClick={handlePrev}
				disabled={page === 1}
				aria-label='Previous page'
			>
				Prev
			</button>

			<span className='pagination-status'>
				Page {page} of {totalPages}
			</span>

			<button
				onClick={handleNext}
				disabled={page === totalPages}
				aria-label='Next page'
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
