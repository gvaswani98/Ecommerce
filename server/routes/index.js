import productRoutes from './products.js';

// TODO: Import other routes as we build them
// import authRoutes from './auth.js';
// import adminRoutes from './admin.js';
// import roleCheck from '../middleware/roleCheck.js';

const configureRoutes = (app) => {
	// Health check route
	app.get('/health', (request, response) => {
		response
			.status(200)
			.json({ status: 'OK', message: 'Server is healthy' });
	});

	// Public product routes
	app.use('/products', productRoutes);

	// TODO: Add authentication routes
	// app.use('/auth', authRoutes);

	// TODO: Add admin-only routes
	// app.use('/admin', roleCheck(['admin']), adminRoutes);

	// Fallback route for unknown paths
	app.use('*', (request, response) => {
		response.status(404).json({ error: 'Route Not Found' });
	});
};

export default configureRoutes;
