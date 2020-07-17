require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

// this line is what part of a file you want to intercept/add output to
// mine is easy since it's going to be the end of the file
// I'll add an option to toggle endOfFile otherwise new text is injected
const targetTextLine = '### Active sensors';

/**
 * This is where you specify the path to the README to be updated
 * along with a target line of text, for my case it was '### Active sensors'
 * then provide the new data to be added to the README
 * 
 * sorry assumed utf-8 format, ain't nobody got time for that(not right now)
 * 
 * @param {string} filePath 
 * @param {string} targetTextLine 
 * @param {string} newText
 */
const updateReadMe = (readMePath, targetTextLine, newText, endOfFile) => {
    let stopOutput = false;
    const newFileLines = [];
    const fileLastUpdated = fs.statSync(readMePath);

    fs.readFileSync(readMePath, 'utf-8').split(/\r?\n/).forEach(function(line) {
        if (targetTextLine === line) {
            console.log(newText);
            newFileLines.push(newText);
            stopOutput = endOfFile;
        }

        if (!stopOutput) {
            newFileLines.push(line);
            console.log(line);
        }
    });

    // now way to tell if suceeded
    fs.writeFileSync(readMePath, newFileLines.join('\n'), {encoding: 'utf-8'});
    const fileNowUpdated = fs.statSync(readMePath);

    if (fileLastUpdated.mtime < fileNowUpdated.mtime) {
        console.log('updated');
    }
}

const getPanelData = async () => {
    axios.get(process.env.PANEL_API_PATH)
        .then(function (response) {
            // format data
            const panelLines = '';
            console.log(response);
            return(panelLines);
        })
        .catch(function (error) {
            return('Failed to get Panel data');
        });
}

// the purpose of this specific eg. hits my own API endpoints for data
const getNewLines = async () => {
    console.log('first');
    console.log(await getPanelData());
    console.log('second');
}

getNewLines();

// updateReadMe(process.env.README_PATH, targetTextLine, 'Huh', true);

// "references"
// https://nodejs.org/en/knowledge/file-system/how-to-read-files-in-nodejs/
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
// lost track, too many tabs open, haven't built that extension yet