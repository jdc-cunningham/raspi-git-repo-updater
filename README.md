# Raspi Git Repo Updater
An automated way to update my profile read me

### About
First let me clarify, this doesn't need to be on a Raspberry Pi to run. It uses `NodeJS` to do its commands eg. JavaScript/command line calls.

Specifically what this thing is for is getting data collected by sensors(pulling data from API/remote database) and preparing/modfiying my profile's README with the stats and then it does the whole git push deal. You use CRON to schedule it. The API part isn't here because I have a VPS that has that data/running the API, I'll just write a new command to batch the data how I want and provide a GET endpoint to call by this process.
