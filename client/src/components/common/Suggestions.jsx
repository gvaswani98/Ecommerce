import React from 'react';
// import '../../styles/components/Suggestions.scss';

const Suggestions = ({ suggestions, onSelect }) => {
	if (!suggestions?.length) return null;

	return (
		<ul className='autocomplete-dropdown'>
			{suggestions.map((suggestion, index) => (
				<li key={index} onClick={() => onSelect(suggestion)}>
					{suggestion}
				</li>
			))}
		</ul>
	);
};

export default Suggestions;
