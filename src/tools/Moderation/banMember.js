const Tool = require("../../structures/Tool");
const ToolManager = require("../../ai/ToolManager");

module.exports = new class extends Tool {

    constructor() {

        super({

            name: "banMember",

            description: "Bane um membro do servidor.",

            category: "Moderation",

            requiredPermission: "BanMembers",

            botPermission: "BanMembers",

            requiresTarget: true,

            parameters: {

                type: "object",

                properties: {

                    userId: {

                        type: "string",

                        description: "ID do usuário que será banido."

                    },

                    reason: {

                        type: "string",

                        description: "Motivo do banimento."

                    }

                },

                required: [
                    "userId"
                ]

            }

        });

    }


    async execute(message, args) {


        const member = await ToolManager.getMember(
            message,
            args.userId
        );


        if (!member) {

            return {

                success: false,

                message: "Usuário não encontrado."

            };

        }



        const check = ToolManager.checkHierarchy(
            message,
            member
        );


        if (!check.allowed) {

            return {

                success: false,

                message: check.reason

            };

        }



        await member.ban({

            reason:
                args.reason ??
                "Banido pelo JeffinPVP_Bot"

        });



        return {

            success: true,

            message:
                `${member.user.username} foi banido.`

        };


    }


};