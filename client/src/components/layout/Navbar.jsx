import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import '../../styles/components/layout/Navbar.scss';

const Navbar = ({ className }) => {
	return (
		<nav className={clsx('navbar', className)}>
			<div className='navbar-container'>
				<Link to='/' className='navbar-logo'>
					ShopSmart
				</Link>
				{/* Add more links or buttons here if needed */}
			</div>
		</nav>
	);
};

export default Navbar;
