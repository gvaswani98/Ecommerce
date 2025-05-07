import React from 'react';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import '../../styles/components/common/Pagination.scss';

const Select = ({
	label,
	name,
	value,
	onChange,
	options = [],
	className,
	id,
	placeholder,
	...props
}) => {
	const generatedId = id || `${name || 'select'}-${nanoid(6)}`;
	const ariaId = `${generatedId}-label`;

	return (
		<div className={clsx('form-group select-group', className)}>
			{label ? (
				<label htmlFor={generatedId}>{label}</label>
			) : (
				<span className='sr-only' id={ariaId}>
					{placeholder || name}
				</span>
			)}

			<select
				id={generatedId}
				name={name}
				value={value}
				onChange={onChange}
				className='form-select'
				aria-label={label ? undefined : placeholder || name}
				aria-labelledby={label ? undefined : ariaId}
				{...props}
			>
				{placeholder && <option value=''>{placeholder}</option>}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default Select;
