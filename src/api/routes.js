const router = require("express").Router();


module.exports = (client) => {


    router.get("/status", (req, res) => {


        res.json({

            online: client.isReady(),

            ping: client.ws.ping,

            servers: client.guilds.cache.size

        });


    });


    return router;

};