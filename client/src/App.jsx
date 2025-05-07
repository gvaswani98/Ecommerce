import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

const App = () => {
	return (
		<>
			<Navbar />
			<main>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
};

export default App;
