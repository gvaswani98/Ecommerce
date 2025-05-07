import React, { useState, useEffect } from 'react';
import Input from './common/Input.jsx';
import Select from './common/Select.jsx';
import Suggestions from './common/Suggestions.jsx';
import productService from '../services/productService.js';
import '../styles/components/SearchForm.scss';

const SearchForm = ({ initialValues, onSearch }) => {
	const [formData, setFormData] = useState({
		q: initialValues.q || '',
		category: initialValues.category || '',
		tenant: initialValues.tenant || '',
		sortBy: initialValues.sortBy || '',
		order: initialValues.order || '',
	});
	const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);
	const [suggestions, setSuggestions] = useState([]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSuggestionClick = (suggestion) => {
		setFormData((prev) => ({ ...prev, q: suggestion }));
		setSuggestions([]);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSuggestions([]);
		onSearch(formData);
	};

	useEffect(() => {
		if (!formData.q || formData.q.trim().length < 2) {
			setSuggestions([]);
			return;
		}

		// 💡 Prevent fetch if autocomplete already disabled
		if (!autocompleteEnabled) {
			return;
		}

		const fetchSuggestions = async () => {
			try {
				const result = await productService.getSuggestions({
					q: formData.q,
				});
				if (result.success) {
					setSuggestions(result.data);
					setAutocompleteEnabled(true);
				} else {
					console.warn(
						'🟡 Autocomplete suggestions disabled:',
						result.error
					);
					setAutocompleteEnabled(false);
					setSuggestions([]);
				}
			} catch (error) {
				console.warn(
					'🟡 Autocomplete suggestions request failed:',
					error.message
				);
				setSuggestions([]);
				setAutocompleteEnabled(false);
			}
		};

		fetchSuggestions();
	}, [formData.q]);

	return (
		<form onSubmit={handleSubmit} className='search-form'>
			{/* <Input
				label='Search'
				name='q'
				value={formData.q}
				onChange={handleChange}
				placeholder='Search by name or description'
				autoComplete='off'
				debounce={true}
				debounceDelay={300}
			/> */}
			<div className='autocomplete-wrapper'>
				<Input
					label='Search'
					name='q'
					value={formData.q}
					onChange={handleChange}
					placeholder='Search by name or description'
					debounce={true}
					debounceDelay={300}
				/>
				<Suggestions
					suggestions={suggestions}
					onSelect={handleSuggestionClick}
				/>
			</div>

			<Input
				label='Category'
				name='category'
				value={formData.category}
				onChange={handleChange}
				placeholder='e.g. Electronics'
			/>

			<Input
				label='Tenant'
				name='tenant'
				value={formData.tenant}
				onChange={handleChange}
				placeholder='e.g. Amazon'
			/>

			<Select
				label='Sort By'
				name='sortBy'
				value={formData.sortBy}
				onChange={handleChange}
				placeholder='Select field'
				options={[
					{ label: 'Name', value: 'name' },
					{ label: 'Price', value: 'price' },
					{ label: 'Relevance (search)', value: 'score' },
				]}
			/>

			<Select
				label='Order'
				name='order'
				value={formData.order}
				onChange={handleChange}
				placeholder='Select order'
				options={[
					{ label: 'Ascending', value: 'asc' },
					{ label: 'Descending', value: 'desc' },
				]}
			/>

			<button type='submit' className='search-btn'>
				Search
			</button>
		</form>
	);
};

export default SearchForm;
