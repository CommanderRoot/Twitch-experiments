#!/usr/local/bin/node
const path = require('path'),
	_exec = require('child_process').exec,
	
	fs = require('ab-fs'),
	request = require('ab-request');

let file = path.resolve(__dirname, 'experiments.json'),
	newData;

function getData() {
	console.log('getData');
	return request.body({
		baseUrl: 'https://www.twitch.tv/',
		url: 'experiments.js',
		qs: {
			v: Date.now()/1000
		}
	});
}

function setVariable(data) {
	console.log('setVariable');
	newData = JSON.stringify(data, null, '\t')
}

function checkAgainstOld() {
	console.log('checkAgainstOld');
	return fs.readFileUTF8(file)
	.then(data => {
		if(data === newData) {
			throw false;
		}
	});
}

function saveNewData() {
	console.log('saveNewData');
	return fs.writeFile(file, newData);
}

function exec(command, options) {
	console.log('exec');
	return new Promise((resolve, reject) => {
		_exec(command, options, (err, stdout, stderr) => {
			if(err) {
				return reject(err);
			}
			resolve(stdout);
		});
	});
}

function updateToGithub() {
	console.log('updateToGithub');
	return Promise.resolve()
	.then(() => exec('git diff --color experiments.json')
		.then(out => console.log(out))
	)
	.then(() => exec('git add experiments.json'))
	.then(() => exec('git commit -m "Update"'))
	.then(() => exec('git push'));
}

void function init() {
	console.log('init');
	console.time('time');
	getData()
	.then(JSON.parse)
	.then(setVariable)
	.then(checkAgainstOld)
	.then(saveNewData)
	.then(updateToGithub)
	.catch(console.log.bind(console))
	.then(() => console.timeEnd('time'));
}();
