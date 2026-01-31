#!/bin/bash

# Get experiments.json
curl --connect-timeout 10 -s --compressed 'https://www.twitch.tv/experiments.json' | jq -M --tab . > experiments.json
if [ -s experiments.json ]; then
	git add experiments.json && git commit -m 'Update experiments.json'
fi

# Get site_options.js
# curl --connect-timeout 10 -s --compressed 'https://www.twitch.tv/site_options.js' | tail -c +22 | head -c -2 | jq -M --tab . > site_options.js
# git add site_options.js && git commit -m 'Update site_options.js'

# Get config
curl --connect-timeout 10 -s --compressed "https://assets.twitch.tv/eppo/api/flag-config/v1/config?sdkName=js-sdk-client&sdkVersion=3.1.2&apiKey=$api_key" | jq -M --tab . > config.json
if [ -s config.json ]; then
	git add config.json && git commit -m 'Update config.json'
fi

# Push to repo
git push
