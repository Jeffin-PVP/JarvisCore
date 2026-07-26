const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");


const serverConfig = require("../../database/serverConfig");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("logs")

        .setDescription(
            "Configura o canal de logs do servidor."
        )


        .addSubcommand(sub =>
            
            sub

            .setName("set")

            .setDescription(
                "Define o canal de logs."
            )

            .addChannelOption(option =>

                option

                .setName("canal")

                .setDescription(
                    "Canal onde os logs serão enviados."
                )

                .addChannelTypes(
                    ChannelType.GuildText
                )

                .setRequired(true)

            )

        )


        .addSubcommand(sub =>

            sub

            .setName("disable")

            .setDescription(
                "Desativa os logs."
            )

        )



        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),




    async execute(interaction) {


        const sub =
            interaction.options.getSubcommand();



        const guildId =
            interaction.guild.id;



        if(sub === "set") {


            const channel =
                interaction.options.getChannel(
                    "canal"
                );



            serverConfig.set(

                guildId,

                {

                    logChannel: channel.id

                }

            );



            return interaction.reply({

                content:
                `✅ Canal de logs definido como ${channel}.`,

                ephemeral:true

            });


        }



        if(sub === "disable") {


            serverConfig.set(

                guildId,

                {

                    logChannel:null

                }

            );



            return interaction.reply({

                content:
                "✅ Logs desativados.",

                ephemeral:true

            });


        }


    }


};