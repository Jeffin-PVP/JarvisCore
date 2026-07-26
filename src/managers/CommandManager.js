const commands = require("../commands");

class CommandManager {

    static get(name) {

        return commands[name];

    }

    static async execute(interaction) {

        const command =
            commands[interaction.commandName];

        if (!command) return;

        return command.execute(interaction);

    }

}

module.exports = CommandManager;