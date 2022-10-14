import pkg from './package.json';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			preferConst: true,
			indent: '\t',
			exports: 'default',
		},
	],
	plugins: [
		resolve(),
		commonjs({transformMixedEsModules: true}),
		json(),
	],
};