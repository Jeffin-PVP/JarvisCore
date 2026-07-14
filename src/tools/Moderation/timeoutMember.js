const Tool = require("../../structures/Tool");
const ToolManager = require("../../ai/ToolManager");

module.exports = new class extends Tool {


    constructor(){

        super({

            name:"timeoutMember",

            description:"Aplica timeout (mute) em um membro.",

            category:"Moderation",

            requiredPermission:"ModerateMembers",

            botPermission:"ModerateMembers",

            requiresTarget:true,


            parameters:{

                type:"object",

                properties:{

                    userId:{

                        type:"string"

                    },

                    minutes:{

                        type:"number",

                        description:"Tempo do timeout em minutos."

                    },

                    reason:{

                        type:"string"

                    }

                },


                required:[

                    "userId",

                    "minutes"

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



        const duration =
            args.minutes * 60 * 1000;



        await member.timeout(

            duration,

            args.reason ??
            "Timeout aplicado pelo JeffinPVP_Bot"

        );



        return {

            success:true,

            message:
            `${member.user.username} recebeu timeout por ${args.minutes} minutos.`

        };


    }


};