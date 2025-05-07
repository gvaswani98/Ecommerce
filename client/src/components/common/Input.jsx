import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/components/common/Input.scss';

const Input = ({
	label,
	name,
	value,
	onChange,
	type = 'text',
	placeholder,
	className,
	id,
	debounce = false,
	debounceDelay = 300,
	...props
}) => {
	const [localValue, setLocalValue] = useState(value);
	const debouncedValue = useDebounce(localValue, debounceDelay);

	const generatedId = id || `${name || 'input'}-${nanoid(6)}`;
	const ariaId = `${generatedId}-label`;

	useEffect(() => {
		if (debounce) setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (debounce) {
			onChange({ target: { name, value: debouncedValue } });
		}
	}, [debouncedValue]);

	const handleChange = (event) => {
		if (debounce) {
			setLocalValue(event.target.value);
		} else {
			onChange(event);
		}
	};

	return (
		<div className={clsx('form-group input-group', className)}>
			{label ? (
				<label htmlFor={generatedId}>{label}</label>
			) : (
				<span className='sr-only' id={ariaId}>
					{placeholder || name}
				</span>
			)}

			<input
				className='form-input'
				id={generatedId}
				type={type}
				name={name}
				value={debounce ? localValue : value}
				onChange={handleChange}
				placeholder={placeholder}
				aria-label={label ? undefined : placeholder || name}
				aria-labelledby={label ? undefined : ariaId}
				autoComplete={debounce ? 'off' : undefined}
				{...props}
			/>
		</div>
	);
};

export default Input;
