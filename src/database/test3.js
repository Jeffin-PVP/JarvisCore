const database = require("./database.js");

(async () => {

    const rows = await database.all(`
        SELECT
            guild_id,
            user_id,
            wallet,
            bank
        FROM economy_users
    `);

    console.table(rows);

})();
//olá