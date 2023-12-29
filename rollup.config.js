
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			indent: '\t',
			exports: 'default',
			generatedCode: {
				constBindings: true,
			},
		},
	],
	plugins: [
		resolve(),
		commonjs({ transformMixedEsModules: true }),
		json(),
	],
};
