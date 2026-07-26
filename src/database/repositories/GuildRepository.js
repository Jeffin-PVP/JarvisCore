const database = require("../database");

class GuildRepository {

    /*
    =========================
        OBTÉM CONFIGURAÇÕES
    =========================
    */

    static async getSettings(guildId) {

        let settings = await database.get(

            `
            SELECT *
            FROM guild_settings
            WHERE guild_id = ?
            `,

            [

                guildId

            ]

        );

        if (!settings) {

            await database.run(

                `
                INSERT INTO guild_settings (
                    guild_id
                )
                VALUES (?)
                `,

                [

                    guildId

                ]

            );

            settings = await database.get(

                `
                SELECT *
                FROM guild_settings
                WHERE guild_id = ?
                `,

                [

                    guildId

                ]

            );

        }

        return settings;

    }

    /*
    =========================
        EXISTE?
    =========================
    */

    static async exists(guildId) {

        const row = await database.get(

            `
            SELECT guild_id
            FROM guild_settings
            WHERE guild_id = ?
            `,

            [

                guildId

            ]

        );

        return !!row;

    }

    /*
    =========================
        UPDATE GENÉRICO
    =========================
    */

    static async update(guildId, values) {

        await this.getSettings(guildId);

        const keys = Object.keys(values);

        if (!keys.length)
            return;

        const fields =
            keys
                .map(key => `${key} = ?`)
                .join(", ");

        const params = [

            ...keys.map(key => values[key]),

            guildId

        ];

        await database.run(

            `
            UPDATE guild_settings
            SET ${fields}
            WHERE guild_id = ?
            `,

            params

        );

    }

    /*
    =========================
        CANAL DE LOGS
    =========================
    */

    static async getLogChannel(guildId) {

        const settings =
            await this.getSettings(guildId);

        return settings.log_channel;

    }

static async setLogChannel({
    guildId,
    channelId
}) {

    console.log("SALVANDO LOG CHANNEL");
    console.log(guildId);
    console.log(channelId);

    await this.update(guildId, {
        log_channel: channelId
    });

    const teste = await this.getSettings(guildId);

    console.log("Depois do update:");
    console.log(teste);
}

    /*
    =========================
        PREFIXO
    =========================
    */

    static async getPrefix(guildId) {

        const settings =
            await this.getSettings(guildId);

        return settings.prefix;

    }

    static async setPrefix(
        guildId,
        prefix
    ) {

        await this.update(

            guildId,

            {

                prefix

            }

        );

    }

    /*
    =========================
        ECONOMIA
    =========================
    */

    static async isEconomyEnabled(guildId) {

        const settings =
            await this.getSettings(guildId);

        return Boolean(
            settings.economy_enabled
        );

    }

    static async setEconomyEnabled(
        guildId,
        enabled
    ) {

        await this.update(

            guildId,

            {

                economy_enabled: enabled ? 1 : 0

            }

        );

    }

    /*
    =========================
        MODERAÇÃO
    =========================
    */

    static async isModerationEnabled(
        guildId
    ) {

        const settings =
            await this.getSettings(guildId);

        return Boolean(
            settings.moderation_enabled
        );

    }

    static async setModerationEnabled(
        guildId,
        enabled
    ) {

        await this.update(

            guildId,

            {

                moderation_enabled: enabled ? 1 : 0

            }

        );

    }

    /*
    =========================
        RESETAR CONFIGURAÇÕES
    =========================
    */

    static async reset(guildId) {

        await database.run(

            `
            DELETE FROM guild_settings
            WHERE guild_id = ?
            `,

            [

                guildId

            ]

        );

    }

}

module.exports = GuildRepository;