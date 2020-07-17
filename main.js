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

const getPanelData = () => {
    return axios.get(process.env.PANEL_API_PATH)
        .then(function (res) {
            if (Object.keys(res.data).length > 0) {
                const panelData = res.data.measurements; // data in DESC order
                if (panelData['1'].panel_id === "le_panel") {
                    return panelData['1'];
                } else {
                    return panelData['2'];
                }
            } else {
                return false;
            }
        })
        .catch(function (err) {
            return false;
        });
}

const roundFcn = (inpNum) => {
    return (Math.round((inpNum * 1000)/10)/100).toFixed(2);
}

const getPanelPower = (voltageStr) => {
    // perform Watt calculation
    // V = IR -> I = V/R
    // W = AV ->  W = I*V
    const voltage = parseFloat(voltageStr.split(' V')[0]);
    const current = roundFcn((voltage / 25));

    return {
        current, // was 110
        powerProduced: roundFcn((current * voltage)) + ' W'
    };
}

const generatePanelLines = (panelData) => {

}

// turbine hah it's an anemometer
const generateTurbineLines = (turbineData) => {

}

// the purpose of this specific eg. hits my own API endpoints for data
const getData = async () => {
    let newSensorLines = '### Sensor data\n';
    const panelData = await getPanelData();

    if (panelData) {
        const panelPower = getPanelPower(panelData.computed);
        const panelSensorLines = [
            '**5V 100mA Solar Cell**',
            `- ${panelData.date}`,
            `- Computed voltage: ${panelData.computed} current: ${panelPower.current}`,
            `- Power produced: ${panelPower.powerProduced}`
        ];
        newSensorLines += panelSensorLines.join('\n');
    }
    
    updateReadMe(process.env.README_PATH, targetTextLine, newSensorLines, true);
}

getData();

// "references"
// https://nodejs.org/en/knowledge/file-system/how-to-read-files-in-nodejs/
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
// lost track, too many tabs open, haven't built that extension yet