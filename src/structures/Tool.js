class Tool {

    constructor(options) {


        this.name = options.name;


        this.description = options.description;


        this.parameters = options.parameters ?? {

            type: "object",

            properties: {},

            required: []

        };


        this.category = options.category ?? "Geral";


        // Apenas dono do bot
        this.ownerOnly = options.ownerOnly ?? false;


        // Precisa estar em servidor
        this.guildOnly = options.guildOnly ?? true;



        // Permissões do usuário
        this.permissions = options.permissions ?? [];



        // Permissão automática necessária
        this.requiredPermission =
            options.requiredPermission ?? null;



        if (this.requiredPermission) {

            this.permissions.push(
                this.requiredPermission
            );

        }



        // Permissão que o BOT precisa possuir
        this.botPermission =
            options.botPermission ?? null;



        // A IA pode utilizar esta ferramenta?
        this.aiEnabled =
            options.aiEnabled ?? true;



        // Precisa de um usuário alvo?
        this.requiresTarget =
            options.requiresTarget ?? false;



        // Tempo de espera
        this.cooldown =
            options.cooldown ?? 0;


    }



    async execute(message, args) {

        throw new Error(
            `A ferramenta "${this.name}" não implementou execute().`
        );

    }


}


module.exports = Tool;