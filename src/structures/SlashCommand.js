class SlashCommand {

    constructor(options = {}) {

        this.data = options.data;
        this.category = options.category || "General";
        this.guildOnly = options.guildOnly ?? true;
        this.permissions = options.permissions || [];

    }

    async execute(interaction) {

        throw new Error(
            "O método execute() precisa ser implementado."
        );

    }

}

module.exports = SlashCommand;