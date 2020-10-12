#!/bin/bash

# Get experiments.json
curl --connect-timeout 10 -s --compressed 'https://www.twitch.tv/experiments.json' | jq -M --tab . > experiments.json
if [ -s experiments.json ]; then
	git add experiments.json && git commit -m 'Update experiments.json'
fi

# Get site_options.js
# curl --connect-timeout 10 -s --compressed 'https://www.twitch.tv/site_options.js' | tail -c +22 | head -c -2 | jq -M --tab . > site_options.js
# git add site_options.js && git commit -m 'Update site_options.js'

# Push to repo
git push
