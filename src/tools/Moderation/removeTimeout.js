const Tool = require("../../structures/Tool");
const ToolManager = require("../../ai/ToolManager");

module.exports = new class extends Tool {


    constructor(){

        super({

            name:"removeTimeout",

            description:"Remove o timeout de um membro.",

            category:"Moderation",

            requiredPermission:"ModerateMembers",

            botPermission:"ModerateMembers",

            requiresTarget:true,


            parameters:{

                type:"object",

                properties:{

                    userId:{

                        type:"string"

                    }

                },

                required:[

                    "userId"

                ]

            }

        });

    }



    async execute(message,args){


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



        await member.timeout(null);



        return {

            success:true,

            message:
            `${member.user.username} teve o timeout removido.`

        };


    }


};