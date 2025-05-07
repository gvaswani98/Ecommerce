import React from 'react';
import clsx from 'clsx';
import '../../styles/components/layout/Footer.scss';

const Footer = ({ className }) => {
	return (
		<footer className={clsx('footer', className)}>
			<div className='footer-content'>
				<p>
					&copy; {new Date().getFullYear()} ShopEasy. All rights
					reserved.
				</p>
				<span>Built with ❤️ using MERN Stack</span>
			</div>
		</footer>
	);
};

export default Footer;
