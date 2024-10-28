const axios = require('axios');
const fs = require('fs');
const cron = require('node-cron');

const email = "gdoff@yopmail.com"; 
const password = "gd1010"; 

const loginAndRefreshAppstate = async () => {
    console.log('Attempting to login...');

    try {
        const response = await axios.get(`https://appstate-emer.onrender.com/appstate?e=${email}&p=${password}`);
        console.log('Login successful!');
        
        const result = response.data;
        const filename = 'appstate.json';
        const previousAppState = fs.existsSync(filename) ? fs.readFileSync(filename) : null;

        fs.writeFileSync(filename, JSON.stringify(result, null, 2));
        console.log('Appstate saved to appstate.json');

        if (previousAppState && previousAppState.toString() !== JSON.stringify(result)) {
            console.log('Appstate has changed. New appstate.json saved.');
        }
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
};

loginAndRefreshAppstate();

cron.schedule('*/30 * * * *', () => {
    console.log('Auto Refresh Appstate has been executed every 5 minutes');
    loginAndRefreshAppstate();
});
