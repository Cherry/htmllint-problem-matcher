const fs = require('fs').promises;
const path = require('path');
const {getInput, setFailed} = require('@actions/core');
const {issueCommand} = require('@actions/core/lib/command');

async function run(){
	try{
		const action = getInput("action");
		const matcherFile = path.join(__dirname, "../", ".github", "problem-matcher.json");
		switch(action){
			case "add":
				issueCommand("add-matcher", {}, matcherFile);
				break;
			case "remove":{
				const fileContents = await fs.readFile(matcherFile, {encoding: "utf8"});
				const problemMatcherDocument = JSON.parse(fileContents);
				const problemMatcher = problemMatcherDocument.problemMatcher[0];
				issueCommand("remove-matcher", {
					owner: problemMatcher.owner
				}, "");
			}
				break;
			default:
				throw Error(`Unsupported action "${action}"`);
		}
	}catch(error){
		setFailed(error.message);
		throw error;
	}
}
run();
export default run;
