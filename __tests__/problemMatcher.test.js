let problemMatcher = require('../.github/problem-matcher.json');
problemMatcher = problemMatcher.problemMatcher[0];

const matchResults = function(string, regexp){
	return string.map(line => regexp.exec(line));
};

describe("problemMatcher", () => {
	it("has the correct owner", () => {
		expect(problemMatcher.owner).toEqual("htmllint");
	});
	it("has one patterns", () => {
		expect(problemMatcher.pattern.length).toEqual(1);
	});
	describe("file pattern", () => {
		let pattern;
		let regexp;
		beforeEach(() => {
			pattern = problemMatcher.pattern[0];
			regexp = new RegExp(pattern.regexp);
		});
		it("matches file path", () => {
			const reportOutput = [
				"src/test.html: line 1, col 1, tag is not closed",
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(1);
			expect(results[0][pattern.file]).toEqual("src/test.html");
		});
	});
	describe("violation pattern", () => {
		let pattern;
		let regexp;
		beforeEach(() => {
			pattern = problemMatcher.pattern[0];
			regexp = new RegExp(pattern.regexp);
		});
		it("matches violations", () => {
			const reportOutput = [
				"src/test.html: line 1, col 1, tag is not closed",
				"src/test.html: line 2, col 2, only <head> and <body> may be children of <html>",
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(2);
		});
		it("matches violation details", () => {
			const reportOutput = [
				"src/test.html: line 1, col 1, tag is not closed",
				"src/foo.html: line 2, col 2, only <head> and <body> may be children of <html>",
				"src/bar.html: line 22, col 52, only <head> and <body> may be children of <html>",
			];
			const results = matchResults(reportOutput, regexp);
			expect(results.length).toEqual(3);

			expect(results[0][pattern.file]).toEqual("src/test.html");
			expect(results[0][pattern.line]).toEqual("1");
			expect(results[0][pattern.column]).toEqual("1");
			expect(results[0][pattern.message]).toEqual("tag is not closed");

			expect(results[1][pattern.file]).toEqual("src/foo.html");
			expect(results[1][pattern.line]).toEqual("2");
			expect(results[1][pattern.column]).toEqual("2");
			expect(results[1][pattern.message]).toEqual("only <head> and <body> may be children of <html>");

			expect(results[2][pattern.file]).toEqual("src/bar.html");
			expect(results[2][pattern.line]).toEqual("22");
			expect(results[2][pattern.column]).toEqual("52");
			expect(results[2][pattern.message]).toEqual("only <head> and <body> may be children of <html>");
		});
	});
});
