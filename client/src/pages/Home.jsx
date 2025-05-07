import React, { useEffect, useState } from 'react';
import SearchForm from '../components/SearchForm.jsx';
import Pagination from '../components/common/Pagination.jsx';
import ProductCard from '../components/ProductCard.jsx';
import productService from '../services/productService.js';
import { DEFAULT_PAGE_LIMIT } from '../constants/common.js';
import '../styles/pages/Home.scss';

const Home = () => {
	const [filters, setFilters] = useState({
		q: '',
		category: '',
		tenant: '',
		page: 1,
		limit: DEFAULT_PAGE_LIMIT,
		sortBy: '',
		order: '',
	});

	const [products, setProducts] = useState([]);
	const [meta, setMeta] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			setError(null);

			try {
				const query = { ...filters };

				const result = query.q?.trim()
					? await productService.searchProducts(query)
					: await productService.getPaginatedProducts(query);

				if (result.success) {
					setProducts(result.data.results || []);
					setMeta(result.data.meta || {});
				} else {
					setError(result.error || 'Something went wrong');
				}
			} catch (err) {
				setError('Failed to fetch products.');
			}

			setLoading(false);
		};

		fetchProducts();
	}, [filters]);

	const handleSearch = (formData) => {
		setFilters((prev) => ({
			...prev,
			...formData,
			page: 1,
		}));
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({
			...prev,
			page: newPage,
		}));
	};

	return (
		<div className='home-page'>
			<h1>Product Search</h1>

			<SearchForm onSearch={handleSearch} initialValues={filters} />

			{loading && <p>Loading...</p>}
			{error && <p className='error'>{error}</p>}
			{!loading && !error && products.length === 0 && (
				<div className='no-results'>No products found</div>
			)}

			<div className='product-grid'>
				{products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>

			<Pagination
				page={meta.page || 1}
				totalPages={meta.totalPages || 1}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default Home;
