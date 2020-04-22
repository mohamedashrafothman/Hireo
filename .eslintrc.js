module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	extends: ["airbnb-base"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 2018
	},
	rules: {
		"indent": ["warn", "tab"],
		"strict": 0,
		"no-useless-constructor": "off",
		"no-console": "off",
		"class-methods-use-this": "off",
		"no-tabs": "off",
		"no-new": "off",
		"consistent-return": "off",
		"no-underscore-dangle": "off",
		"no-useless-escape": "off",
		"comma-dangle": "off",
		"linebreak-style": "off",
		"no-multi-spaces": "off",
		"no-plusplus": ["warn"],
		"no-await-in-loop": ["warn"],
		"camelcase": "off",
		"quotes": ["error", "double"],
		"max-len": ["error", {
			code: 300,
			ignoreComments: true,
			ignoreTrailingComments: true,
			ignoreUrls: true,
			ignoreStrings: true
		}],
		"no-multi-spaces": ["error", {
			exceptions: {
				VariableDeclarator: true,
				ImportDeclaration: true
			}
		}],
		"no-param-reassign": ["warn", {
			props: false
		}],
	}
};
