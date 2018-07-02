#!/usr/local/bin/node
const path = require('path'),
	_exec = require('child_process').exec,
	
	fs = require('ab-fs'),
	request = require('ab-request');

let file = path.resolve(__dirname, 'experiments.json'), newData;
let file2 = path.resolve(__dirname, 'site_options.js'), newData2;

function getData() {
	console.log('getData');
	return request.body({
		baseUrl: 'https://www.twitch.tv/',
		url: 'experiments.json',
		qs: {
			v: Date.now()/1000
		}
	});
}

function getData2() {
	console.log('getData2');
	return request.body({
		baseUrl: 'https://www.twitch.tv/',
		url: 'site_options.js',
		qs: {
			v: Date.now()/1000
		}
	});
}

function removeJavascript(data) {
	console.log('removeJavascript');
	return data.replace(/(^window.SiteOptions = )/g, '').replace(/(;(\s+)?$)/g, '');
}

function setVariable(data) {
	console.log('setVariable');
	newData = JSON.stringify(data, null, '\t')
}
function setVariable2(data) {
	console.log('setVariable2');
	newData2 = JSON.stringify(data, null, '\t')
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

function checkAgainstOld2() {
	console.log('checkAgainstOld2');
	return fs.readFileUTF8(file2)
	.then(data => {
		if(data === newData2) {
			throw false;
		}
	});
}

function saveNewData() {
	console.log('saveNewData');
	return fs.writeFile(file, newData);
}

function saveNewData2() {
	console.log('saveNewData2');
	return fs.writeFile(file2, newData2);
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
	.then(() => exec('git commit -m "Update experiments.json"'))
	.then(() => exec('git push'));
}

function updateToGithub2() {
	console.log('updateToGithub2');
	return Promise.resolve()
	.then(() => exec('git diff --color site_options.js')
		.then(out => console.log(out))
	)
	.then(() => exec('git add site_options.js'))
	.then(() => exec('git commit -m "Update site_options.js"'))
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

	/*
	console.time('time2');
	getData2()
	.then(removeJavascript)
	.then(JSON.parse)
	.then(setVariable2)
	.then(checkAgainstOld2)
	.then(saveNewData2)
	.then(updateToGithub2)
	.catch(console.log.bind(console))
	.then(() => console.timeEnd('time2'));
	*/

}();
