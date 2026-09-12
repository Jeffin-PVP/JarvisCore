const database = require("../database");

class GiveawayRepository {

    /*
    =========================
        CRIAÇÃO
    =========================
    */

    static async create({
        guildId,
        channelId,
        hostId,
        prize,
        winnersCount,
        requiredRoleId,
        endsAt
    }) {

        const result = await database.run(

            `
            INSERT INTO giveaways (
                guild_id, channel_id, host_id, prize,
                winners_count, required_role_id, ends_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,

            [
                guildId,
                channelId,
                hostId,
                prize,
                winnersCount,
                requiredRoleId || null,
                endsAt
            ]

        );

        return result.lastID;

    }

    static async setMessageId(id, messageId) {

        await database.run(

            `
            UPDATE giveaways
            SET message_id = ?
            WHERE id = ?
            `,

            [messageId, id]

        );

    }

    /*
    =========================
        CONSULTAS
    =========================
    */

    static async get(id) {

        return database.get(

            `
            SELECT *
            FROM giveaways
            WHERE id = ?
            `,

            [id]

        );

    }

    static async getByMessageId(messageId) {

        return database.get(

            `
            SELECT *
            FROM giveaways
            WHERE message_id = ?
            `,

            [messageId]

        );

    }

    static async listRunningByGuild(guildId) {

        return database.all(

            `
            SELECT *
            FROM giveaways
            WHERE guild_id = ? AND status = 'running'
            ORDER BY ends_at ASC
            `,

            [guildId]

        );

    }

    static async listDue(now) {

        return database.all(

            `
            SELECT *
            FROM giveaways
            WHERE status = 'running' AND ends_at <= ?
            `,

            [now]

        );

    }

    /*
    =========================
        STATUS
    =========================
    */

    static async setStatus(id, status) {

        await database.run(

            `
            UPDATE giveaways
            SET status = ?
            WHERE id = ?
            `,

            [status, id]

        );

    }

    /*
    =========================
        PARTICIPAÇÕES
    =========================
    */

    static async addEntry(giveawayId, userId) {

        await database.run(

            `
            INSERT OR IGNORE INTO giveaway_entries (giveaway_id, user_id)
            VALUES (?, ?)
            `,

            [giveawayId, userId]

        );

    }

    static async removeEntry(giveawayId, userId) {

        await database.run(

            `
            DELETE FROM giveaway_entries
            WHERE giveaway_id = ? AND user_id = ?
            `,

            [giveawayId, userId]

        );

    }

    static async hasEntry(giveawayId, userId) {

        const row = await database.get(

            `
            SELECT 1
            FROM giveaway_entries
            WHERE giveaway_id = ? AND user_id = ?
            `,

            [giveawayId, userId]

        );

        return !!row;

    }

    static async countEntries(giveawayId) {

        const row = await database.get(

            `
            SELECT COUNT(*) AS total
            FROM giveaway_entries
            WHERE giveaway_id = ?
            `,

            [giveawayId]

        );

        return row?.total || 0;

    }

    static async listEntries(giveawayId) {

        const rows = await database.all(

            `
            SELECT user_id
            FROM giveaway_entries
            WHERE giveaway_id = ?
            `,

            [giveawayId]

        );

        return rows.map(row => row.user_id);

    }

}

module.exports = GiveawayRepository;
