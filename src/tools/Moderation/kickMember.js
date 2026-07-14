const Tool = require("../../structures/Tool");
const ToolManager = require("../../ai/ToolManager");

module.exports = new class extends Tool {


    constructor() {

        super({

            name: "kickMember",

            description: "Expulsa um membro do servidor.",

            category: "Moderation",

            requiredPermission: "KickMembers",

            botPermission: "KickMembers",

            requiresTarget: true,

            parameters: {

                type:"object",

                properties: {

                    userId: {

                        type:"string"

                    },

                    reason: {

                        type:"string"

                    }

                },

                required:[

                    "userId"

                ]

            }

        });

    }



    async execute(message,args) {


        const member =
            await ToolManager.getMember(
                message,
                args.userId
            );



        if(!member){

            return {

                success:false,

                message:"Usuário não encontrado."

            };

        }



        const check =
            ToolManager.checkHierarchy(
                message,
                member
            );



        if(!check.allowed){

            return {

                success:false,

                message:check.reason

            };

        }



        await member.kick(

            args.reason ??
            "Expulso pelo JeffinPVP_Bot"

        );



        return {

            success:true,

            message:
            `${member.user.username} foi expulso.`

        };


    }


};