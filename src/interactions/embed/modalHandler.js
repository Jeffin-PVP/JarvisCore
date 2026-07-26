const {
    EmbedBuilder
} = require("discord.js");

const EmbedButtons =
    require("./EmbedButtons");

module.exports = {

    async execute(interaction) {

        if (!interaction.isModalSubmit())
            return;

        /*
        =========================
            EDITAR
        =========================
        */

        if (interaction.customId === "embed_edit_modal") {

            const embed =
                EmbedBuilder.from(
                    interaction.message.embeds[0]
                );

            const title =
                interaction.fields
                    .getTextInputValue("title")
                    .trim();

            const description =
                interaction.fields
                    .getTextInputValue("description")
                    .trim();

            const color =
                interaction.fields
                    .getTextInputValue("color")
                    .trim();

            if (title)
                embed.setTitle(title);
            else
                embed.setTitle(null);

            if (description)
                embed.setDescription(description);
            else
                embed.setDescription(null);

            if (color) {

                try {

                    embed.setColor(color);

                } catch { }

            }

            return interaction.update({

                embeds: [

                    embed

                ],

                components:

                    EmbedButtons.build()

            });

        }

        /*
        =========================
            IMAGENS
        =========================
        */

        if (interaction.customId === "embed_images_modal") {

            const embed =
                EmbedBuilder.from(
                    interaction.message.embeds[0]
                );

            const thumbnail =
                interaction.fields
                    .getTextInputValue("thumbnail")
                    .trim();

            const image =
                interaction.fields
                    .getTextInputValue("image")
                    .trim();

            if (thumbnail)
                embed.setThumbnail(thumbnail);
            else
                embed.setThumbnail(null);

            if (image)
                embed.setImage(image);
            else
                embed.setImage(null);

            return interaction.update({

                embeds: [

                    embed

                ],

                components:

                    EmbedButtons.build()

            });

        }

        /*
=========================
    RODAPÉ
=========================
*/

        if (interaction.customId === "embed_footer_modal") {

            const embed =
                EmbedBuilder.from(
                    interaction.message.embeds[0]
                );

            const text =
                interaction.fields
                    .getTextInputValue("footer_text")
                    .trim();

            const icon =
                interaction.fields
                    .getTextInputValue("footer_icon")
                    .trim();

            if (text) {

                embed.setFooter({

                    text,

                    iconURL:
                        icon || null

                });

            } else {

                embed.setFooter(null);

            }

            return interaction.update({

                embeds: [

                    embed

                ],

                components:

                    EmbedButtons.build()

            });

        }

        /*
=========================
    AUTOR
=========================
*/

        if (interaction.customId === "embed_author_modal") {

            const embed =
                EmbedBuilder.from(
                    interaction.message.embeds[0]
                );

            const name =
                interaction.fields
                    .getTextInputValue("author_name")
                    .trim();

            const icon =
                interaction.fields
                    .getTextInputValue("author_icon")
                    .trim();

            const url =
                interaction.fields
                    .getTextInputValue("author_url")
                    .trim();

            if (name) {

                embed.setAuthor({

                    name,

                    iconURL:
                        icon || null,

                    url:
                        url || null

                });

            } else {

                embed.setAuthor(null);

            }

            return interaction.update({

                embeds: [

                    embed

                ],

                components:

                    EmbedButtons.build()

            });

        }

    }

};