const PRODUCT_INDEX = 'products';

// const productMapping = {
// 	mappings: {
// 		properties: {
// 			name: {
// 				type: 'text',
// 			},
// 			name_suggest: {
// 				type: 'completion',
// 			},
// 		},
// 	},
// };

const productMapping = {
	mappings: {
		properties: {
			name: {
				type: 'text',
			},
			description: {
				type: 'text',
			},
		},
	},
};

// const productMapping = {
// 	settings: {
// 		analysis: {
// 			analyzer: {
// 				autocomplete: {
// 					type: 'custom',
// 					tokenizer: 'standard',
// 					filter: ['lowercase', 'edge_ngram'],
// 				},
// 			},
// 			filter: {
// 				edge_ngram: {
// 					type: 'edge_ngram',
// 					min_gram: 1,
// 					max_gram: 20,
// 				},
// 			},
// 		},
// 	},
// 	mappings: {
// 		properties: {
// 			name: {
// 				type: 'text',
// 				analyzer: 'autocomplete',
// 				search_analyzer: 'standard',
// 			},
// 			name_suggest: {
// 				type: 'completion',
// 			},
// 		},
// 	},
// };

export { PRODUCT_INDEX, productMapping };
