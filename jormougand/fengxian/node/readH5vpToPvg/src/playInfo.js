const { errorcode } = require("./errorcode");
const playConfig = {
    g_loginfo_type1: {
        devicetype: "pvgplus",
        ip: "10.232.75.89",
        password: "123456",
        port: 2015,
        user: "gelin",
    },
    g_loginfo_type2: {
        devicetype: "pvgplus",
        ip: "10.232.75.91",
        password: "123456",
        port: 2015,
        user: "gelin",
    },
};
module.exports = {
    errorcode,
    playConfig
}