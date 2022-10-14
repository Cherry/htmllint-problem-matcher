const fs = require('node:fs').promises;
const path = require('node:path');
const {getInput, setFailed} = require('@actions/core');
const {issueCommand} = require('@actions/core/lib/command');

async function run(){
	const action = getInput("action");
	const matcherFile = path.join(__dirname, "../", ".github", "problem-matcher.json");
	switch(action){
		case "add":{
			issueCommand("add-matcher", {}, matcherFile);
			break;
		}
		case "remove":{
			const fileContents = await fs.readFile(matcherFile);
			const problemMatcherDocument = JSON.parse(fileContents);
			const problemMatcher = problemMatcherDocument.problemMatcher[0];
			issueCommand("remove-matcher", {
				owner: problemMatcher.owner,
			}, "");
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
