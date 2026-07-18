const database = require("../database");

class EconomyRepository {

    /*
    =========================
        OBTÉM O USUÁRIO
    =========================
    */

    static async getUser(
        guildId,
        userId
    ) {

        let user = await database.get(

            `
            SELECT *
            FROM economy_users
            WHERE guild_id = ?
            AND user_id = ?
            `,

            [

                guildId,
                userId

            ]

        );

        if (!user) {

            await database.run(

                `
                INSERT INTO economy_users (

                    guild_id,
                    user_id

                )

                VALUES (?, ?)
                `,

                [

                    guildId,
                    userId

                ]

            );

            user = await database.get(

                `
                SELECT *
                FROM economy_users
                WHERE guild_id = ?
                AND user_id = ?
                `,

                [

                    guildId,
                    userId

                ]

            );

        }

        return user;

    }

    /*
    =========================
        EXISTE?
    =========================
    */

    static async exists(
        guildId,
        userId
    ) {

        const row = await database.get(

            `
            SELECT user_id
            FROM economy_users
            WHERE guild_id = ?
            AND user_id = ?
            `,

            [

                guildId,
                userId

            ]

        );

        return !!row;

    }

    /*
    =========================
        UPDATE GENÉRICO
    =========================
    */

    static async update(
        guildId,
        userId,
        values
    ) {

        await this.getUser(
            guildId,
            userId
        );

        const keys =
            Object.keys(values);

        if (!keys.length)
            return;

        const fields =
            keys
                .map(key => `${key} = ?`)
                .join(", ");

        const params = [

            ...keys.map(key => values[key]),

            guildId,
            userId

        ];

        await database.run(

            `
            UPDATE economy_users
            SET ${fields}
            WHERE guild_id = ?
            AND user_id = ?
            `,

            params

        );

    }

    /*
    =========================
        CARTEIRA
    =========================
    */

    static async getWallet(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.wallet;

    }

    static async setWallet(
        guildId,
        userId,
        amount
    ) {

        await this.update(

            guildId,
            userId,

            {

                wallet: Math.max(
                    0,
                    amount
                )

            }

        );

    }

    static async addWallet(
        guildId,
        userId,
        amount
    ) {

        const wallet =
            await this.getWallet(
                guildId,
                userId
            );

        await this.setWallet(

            guildId,
            userId,

            wallet + amount

        );

    }

    static async removeWallet(
        guildId,
        userId,
        amount
    ) {

        const wallet =
            await this.getWallet(
                guildId,
                userId
            );

        await this.setWallet(

            guildId,
            userId,

            wallet - amount

        );

    }

    /*
    =========================
        BANCO
    =========================
    */

    static async getBank(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.bank;

    }

    static async setBank(
        guildId,
        userId,
        amount
    ) {

        await this.update(

            guildId,
            userId,

            {

                bank: Math.max(
                    0,
                    amount
                )

            }

        );

    }

    static async addBank(
        guildId,
        userId,
        amount
    ) {

        const bank =
            await this.getBank(
                guildId,
                userId
            );

        await this.setBank(

            guildId,
            userId,

            bank + amount

        );

    }

    static async removeBank(
        guildId,
        userId,
        amount
    ) {

        const bank =
            await this.getBank(
                guildId,
                userId
            );

        await this.setBank(

            guildId,
            userId,

            bank - amount

        );

    }
        /*
    =========================
        XP
    =========================
    */

    static async getXP(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.xp;

    }

    static async setXP(
        guildId,
        userId,
        amount
    ) {

        await this.update(

            guildId,
            userId,

            {

                xp: Math.max(
                    0,
                    amount
                )

            }

        );

    }

    static async addXP(
        guildId,
        userId,
        amount
    ) {

        const xp =
            await this.getXP(
                guildId,
                userId
            );

        await this.setXP(

            guildId,
            userId,

            xp + amount

        );

    }

    /*
    =========================
        LEVEL
    =========================
    */

    static async getLevel(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.level;

    }

    static async setLevel(
        guildId,
        userId,
        level
    ) {

        await this.update(

            guildId,
            userId,

            {

                level: Math.max(
                    1,
                    level
                )

            }

        );

    }

    /*
    =========================
        DAILY
    =========================
    */

    static async getDaily(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.daily_at;

    }

    static async setDaily(
        guildId,
        userId,
        timestamp
    ) {

        await this.update(

            guildId,
            userId,

            {

                daily_at: timestamp

            }

        );

    }

    /*
    =========================
        WORK
    =========================
    */

    static async getWork(
        guildId,
        userId
    ) {

        const user =
            await this.getUser(
                guildId,
                userId
            );

        return user.work_at;

    }

    static async setWork(
        guildId,
        userId,
        timestamp
    ) {

        await this.update(

            guildId,
            userId,

            {

                work_at: timestamp

            }

        );

    }

    /*
    =========================
        TRANSAÇÕES
    =========================
    */

    static async createTransaction({

        guildId,

        userId,

        type,

        amount,

        reason = null

    }) {

        await database.run(

            `
            INSERT INTO economy_transactions (

                guild_id,

                user_id,

                type,

                amount,

                reason

            )

            VALUES (?, ?, ?, ?, ?)
            `,

            [

                guildId,

                userId,

                type,

                amount,

                reason

            ]

        );

    }

    static async getTransactions(

        guildId,

        userId,

        limit = 20

    ) {

        return await database.all(

            `
            SELECT *
            FROM economy_transactions
            WHERE guild_id = ?
            AND user_id = ?
            ORDER BY id DESC
            LIMIT ?
            `,

            [

                guildId,

                userId,

                limit

            ]

        );

    }

    /*
    =========================
        LEADERBOARD
    =========================
    */

    static async getLeaderboard(

        guildId,

        limit = 10

    ) {

        return await database.all(

            `
            SELECT *

            FROM economy_users

            WHERE guild_id = ?

            ORDER BY

                (wallet + bank)

            DESC

            LIMIT ?
            `,

            [

                guildId,

                limit

            ]

        );

    }

    /*
    =========================
        RESET
    =========================
    */

    static async resetUser(

        guildId,

        userId

    ) {

        await this.update(

            guildId,

            userId,

            {

                wallet: 0,

                bank: 0,

                xp: 0,

                level: 1,

                daily_at: null,

                work_at: null

            }

        );

    }

    static async resetGuild(

        guildId

    ) {

        await database.run(

            `
            DELETE FROM economy_users

            WHERE guild_id = ?
            `,

            [

                guildId

            ]

        );

        await database.run(

            `
            DELETE FROM economy_transactions

            WHERE guild_id = ?
            `,

            [

                guildId

            ]

        );

    }

}

module.exports = EconomyRepository;