const fs = require("fs");
const path = require("path");

const commands = {};

function load(dir) {

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const filePath = path.join(dir, file);

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {

            load(filePath);
            continue;

        }

        if (!file.endsWith(".js")) continue;

        if (file === "index.js") continue;

        const command = require(filePath);

        if (!command.data) continue;

        commands[command.data.name] = command;

        console.log(
            `✔ Slash carregado: ${command.data.name}`
        );

    }

}

load(__dirname);

module.exports = commands;