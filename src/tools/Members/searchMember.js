const Tool = require("../../structures/Tool");

module.exports = new class extends Tool {


    constructor() {

        super({

            name: "searchMember",

            description:
                "Procura um membro do servidor pelo nome, username ou apelido e retorna o ID correto do Discord para usar em outras ferramentas.",

            category: "Members",

            parameters: {

                type:"object",

                properties:{

                    query:{

                        type:"string",

                        description:"Nome ou apelido do usuário."

                    }

                },

                required:[

                    "query"

                ]

            }

        });

    }


    async execute(message,args){


        await message.guild.members.fetch();


        const query = args.query.toLowerCase();


        return message.guild.members.cache

            .filter(member =>

                member.user.username
                    .toLowerCase()
                    .includes(query)

                ||

                member.displayName
                    .toLowerCase()
                    .includes(query)

            )

            .first(10)

            .map(member => ({

                id:member.id,

                username:member.user.username,

                nickname:member.displayName

            }));


    }


};