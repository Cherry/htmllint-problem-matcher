import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import problemMatcherData from '../.github/problem-matcher.json';
import htmllintProblemMatcher from '../src/index';

const problemMatcher = problemMatcherData.problemMatcher[0];
const matchResults = function(string, regexp) {
	return string.map(line => regexp.exec(line));
};

describe('problemMatcher', () => {
	it('has the correct owner', () => {
		expect(problemMatcher.owner).toEqual('htmllint');
	});
	it('has one patterns', () => {
		expect(problemMatcher.pattern.length).toEqual(1);
	});
	describe('file pattern', () => {
		let pattern;
		let regexp;
		beforeEach(() => {
			pattern = problemMatcher.pattern[0];
			regexp = new RegExp(pattern.regexp);
		});
		it('matches file path', () => {
			const reportOutput = [
				'src/test.html: line 1, col 1, tag is not closed',
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(1);
			expect(results[0][pattern.file]).toEqual('src/test.html');
		});
	});
	describe('violation pattern', () => {
		let pattern;
		let regexp;
		beforeEach(() => {
			pattern = problemMatcher.pattern[0];
			regexp = new RegExp(pattern.regexp);
		});
		it('matches violations', () => {
			const reportOutput = [
				'src/test.html: line 1, col 1, tag is not closed',
				'src/test.html: line 2, col 2, only <head> and <body> may be children of <html>',
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(2);
		});
		it('matches violation details', () => {
			const reportOutput = [
				'src/test.html: line 1, col 1, tag is not closed',
				'src/foo.html: line 2, col 2, only <head> and <body> may be children of <html>',
				'src/bar.html: line 22, col 52, only <head> and <body> may be children of <html>',
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(3);

			expect(results[0][pattern.file]).toEqual('src/test.html');
			expect(results[0][pattern.line]).toEqual('1');
			expect(results[0][pattern.column]).toEqual('1');
			expect(results[0][pattern.message]).toEqual('tag is not closed');

			expect(results[1][pattern.file]).toEqual('src/foo.html');
			expect(results[1][pattern.line]).toEqual('2');
			expect(results[1][pattern.column]).toEqual('2');
			expect(results[1][pattern.message]).toEqual('only <head> and <body> may be children of <html>');

			expect(results[2][pattern.file]).toEqual('src/bar.html');
			expect(results[2][pattern.line]).toEqual('22');
			expect(results[2][pattern.column]).toEqual('52');
			expect(results[2][pattern.message]).toEqual('only <head> and <body> may be children of <html>');
		});
	});
});

describe('loads JS', () => {
	it('loads the JS file', () => {
		expect(htmllintProblemMatcher).toBeDefined();
	});

	it('throws with no input', async () => {
		await expect(htmllintProblemMatcher()).rejects.toThrowError('Unsupported action ""');
	});
});

describe('throws with invalid action', () => {
	beforeAll(() => {
		process.env.INPUT_ACTION = 'foo';
	});
	afterAll(() => {
		delete process.env.INPUT_ACTION;
	});

	it('throws with invalid action', async () => {
		await expect(htmllintProblemMatcher()).rejects.toThrowError('Unsupported action "foo"');
	});
});

describe('adds matcher', () => {
	beforeAll(() => {
		process.env.INPUT_ACTION = 'add';
	});
	afterAll(() => {
		delete process.env.INPUT_ACTION;
	});

	it('adds the matcher', async () => {
		const logs: (string | Uint8Array)[] = [];
		const logMock = vi.spyOn(process.stdout, 'write').mockImplementation((message) => {
			logs.push(message);
			return true;
		});

		await expect(htmllintProblemMatcher()).resolves.toBeUndefined();
		expect(logs).toEqual(
			expect.arrayContaining([
				expect.stringContaining('::add-matcher::'),
			]),
		);
		logMock.mockRestore();
	});
});

describe('removes matcher', () => {
	beforeAll(() => {
		process.env.INPUT_ACTION = 'remove';
	});
	afterAll(() => {
		delete process.env.INPUT_ACTION;
	});

	it('removes the matcher', async () => {
		const logs: (string | Uint8Array)[] = [];
		const logMock = vi.spyOn(process.stdout, 'write').mockImplementation((message) => {
			logs.push(message);
			return true;
		});

		await expect(htmllintProblemMatcher()).resolves.toBeUndefined();
		expect(logs).toEqual(
			expect.arrayContaining([
				expect.stringContaining('::remove-matcher'),
			]),
		);
		logMock.mockRestore();
	});
});
