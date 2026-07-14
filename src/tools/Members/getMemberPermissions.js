const Tool = require("../../structures/Tool");

module.exports = new class extends Tool {


    constructor() {

        super({

            name: "getMemberPermissions",

            description: "Verifica as permissões de um membro.",

            category: "Members",

            parameters: {

                type: "object",

                properties: {

                    userId: {

                        type: "string"

                    }

                },

                required: [

                    "userId"

                ]

            }

        });

    }


    async execute(message, args) {


        const member = await message.guild.members.fetch(args.userId)
            .catch(() => null);


        if (!member) {

            return {

                success:false,

                message:"Usuário não encontrado."

            };

        }


        const permissions = member.permissions;


        return {

            administrator: permissions.has("Administrator"),

            manageGuild: permissions.has("ManageGuild"),

            manageRoles: permissions.has("ManageRoles"),

            manageChannels: permissions.has("ManageChannels"),

            manageMessages: permissions.has("ManageMessages"),

            kickMembers: permissions.has("KickMembers"),

            banMembers: permissions.has("BanMembers"),

            moderateMembers: permissions.has("ModerateMembers")

        };


    }


};