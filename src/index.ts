import { promises as fs } from 'node:fs';
import path from 'node:path';

import { getInput, setFailed } from '@actions/core';
import { issueCommand } from '@actions/core/lib/command';

async function run() {
	const action = getInput('action');
	const matcherFile = path.join(__dirname, '../', '.github', 'problem-matcher.json');
	switch (action) {
		case 'add': {
			issueCommand('add-matcher', {}, matcherFile);
			break;
		}
		case 'remove': {
			const fileContents = await fs.readFile(matcherFile);
			const problemMatcherDocument = JSON.parse(fileContents.toString());
			const problemMatcher = problemMatcherDocument.problemMatcher[0];
			issueCommand('remove-matcher', {
				owner: problemMatcher.owner,
			}, '');
			break;
		}
		default: {
			throw new Error(`Unsupported action "${action}"`);
		}
	}
}
run().catch((error) => {
	console.error(error);
	setFailed(error.message);
});
export default run;
