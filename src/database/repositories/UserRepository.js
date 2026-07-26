const database = require("../database");


class UserRepository {



    static async create({

        userId,

        guildId

    }) {


        await database.run(`

            INSERT OR IGNORE INTO users

            (

                user_id,

                guild_id

            )

            VALUES

            (

                ?,

                ?

            )

        `, [

            userId,

            guildId

        ]);


    }




    static async get({

        userId,

        guildId

    }) {


        await this.create({

            userId,

            guildId

        });



        return await database.get(`

            SELECT *

            FROM users

            WHERE user_id = ?

            AND guild_id = ?

        `, [

            userId,

            guildId

        ]);

    }




    static async addCoins({

        userId,

        guildId,

        amount

    }) {


        await this.create({

            userId,

            guildId

        });



        await database.run(`

            UPDATE users

            SET coins = coins + ?

            WHERE user_id = ?

            AND guild_id = ?

        `, [

            amount,

            userId,

            guildId

        ]);

    }




    static async removeCoins({

        userId,

        guildId,

        amount

    }) {


        await database.run(`

            UPDATE users

            SET coins = coins - ?

            WHERE user_id = ?

            AND guild_id = ?

        `, [

            amount,

            userId,

            guildId

        ]);

    }




    static async setCoins({

        userId,

        guildId,

        amount

    }) {


        await database.run(`

            UPDATE users

            SET coins = ?

            WHERE user_id = ?

            AND guild_id = ?

        `, [

            amount,

            userId,

            guildId

        ]);

    }




    static async addXP({

        userId,

        guildId,

        amount

    }) {


        await this.create({

            userId,

            guildId

        });



        await database.run(`

            UPDATE users

            SET xp = xp + ?

            WHERE user_id = ?

            AND guild_id = ?

        `, [

            amount,

            userId,

            guildId

        ]);

    }


}


module.exports = UserRepository;