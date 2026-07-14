const fs = require("fs");
const path = require("path");


const file = path.join(
    __dirname,
    "servers.json"
);



function load() {

    if (!fs.existsSync(file)) {

        fs.writeFileSync(
            file,
            JSON.stringify({}, null, 4)
        );

    }


    return JSON.parse(
        fs.readFileSync(file)
    );

}



function save(data) {

    fs.writeFileSync(
        file,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}



module.exports = {


    get(guildId) {

        const data = load();

        return data[guildId] ?? {};

    },



    set(guildId, values) {

        const data = load();


        data[guildId] = {

            ...data[guildId],

            ...values

        };


        save(data);


        return data[guildId];

    },


    delete(guildId) {

        const data = load();


        delete data[guildId];


        save(data);

    }


};