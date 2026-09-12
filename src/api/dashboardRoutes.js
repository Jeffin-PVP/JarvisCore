const router = require("express").Router();

const { login, logout, requireAuth } = require("./dashboardAuth");
const SettingsRepository = require("../database/repositories/SettingsRepository");
const PresenceManager = require("../managers/PresenceManager");
const BroadcastManager = require("../managers/BroadcastManager");
const { encontrarCanalDeAnuncio } = require("../utils/findAnnounceChannel");

module.exports = (client) => {

    /*
    =========================
        AUTENTICAÇÃO
    =========================
    */

    router.post("/login", login);
    router.post("/logout", requireAuth, logout);

    // Tudo abaixo daqui exige token válido
    router.use(requireAuth);

    /*
    =========================
        VISÃO GERAL
    =========================
    */

    router.get("/overview", (req, res) => {

        const totalMembros = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

        res.json({
            online: client.isReady(),
            tag: client.user?.tag || null,
            avatar: client.user?.displayAvatarURL() || null,
            id: client.user?.id || null,
            ping: client.ws.ping,
            servers: client.guilds.cache.size,
            members: totalMembros,
            uptimeMs: client.uptime,
            node: process.version,
            memory: process.memoryUsage()
        });

    });

    /*
    =========================
        SERVIDORES
    =========================
    */

    router.get("/guilds", (req, res) => {

        const guilds = client.guilds.cache.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.iconURL({ size: 128 }) || null,
            memberCount: g.memberCount,
            ownerId: g.ownerId,
            joinedAt: g.joinedTimestamp
        })).sort((a, b) => b.memberCount - a.memberCount);

        res.json({ guilds });

    });

    router.post("/guilds/:id/leave", async (req, res) => {

        const guild = client.guilds.cache.get(req.params.id);

        if (!guild) {

            return res.status(404).json({ error: "Servidor não encontrado (o bot não está nele)." });

        }

        const nome = guild.name;

        try {

            await guild.leave();
            res.json({ ok: true, message: `Saí do servidor "${nome}".` });

        } catch (error) {

            res.status(500).json({ error: `Não foi possível sair: ${error.message}` });

        }

    });

    router.get("/guilds/:id/invite", async (req, res) => {

        const guild = client.guilds.cache.get(req.params.id);

        if (!guild) {

            return res.status(404).json({ error: "Servidor não encontrado (o bot não está nele)." });

        }

        try {

            const canal = await encontrarCanalDeAnuncio(guild);

            if (!canal) {

                return res.status(400).json({ error: "Não achei nenhum canal onde eu possa criar um convite." });

            }

            const invite = await canal.createInvite({
                maxAge: 3600,
                maxUses: 1,
                unique: true,
                reason: "Convite gerado pelo dashboard do dono"
            });

            res.json({ url: invite.url, expiresInSeconds: 3600 });

        } catch (error) {

            res.status(500).json({ error: `Não foi possível criar o convite: ${error.message}` });

        }

    });

    /*
    =========================
        PRESENÇA / STATUS
    =========================
    */

    router.get("/presence", async (req, res) => {

        const lista = await SettingsRepository.listPresence();
        const intervalo = await SettingsRepository.get("presence_interval_seconds", "15");

        res.json({
            tipos: PresenceManager.TIPOS_ATIVIDADE,
            intervalSeconds: parseInt(intervalo, 10) || 15,
            statuses: lista
        });

    });

    router.post("/presence", async (req, res) => {

        const { statuses, intervalSeconds } = req.body || {};

        if (!Array.isArray(statuses)) {

            return res.status(400).json({ error: "\"statuses\" precisa ser uma lista." });

        }

        const validos = statuses
            .map(s => ({
                type: PresenceManager.TIPOS_ATIVIDADE.includes(s.type) ? s.type : "WATCHING",
                text: String(s.text || "").trim().slice(0, 128)
            }))
            .filter(s => s.text.length > 0);

        await SettingsRepository.replaceAllPresence(validos);

        if (intervalSeconds && Number(intervalSeconds) >= 5) {

            await SettingsRepository.set("presence_interval_seconds", String(Math.floor(Number(intervalSeconds))));

        }

        await PresenceManager.recarregar();

        res.json({ ok: true });

    });

    /*
    =========================
        COMUNICADOS
    =========================
    */

    router.post("/broadcast", async (req, res) => {

        const { title, description, color } = req.body || {};

        if (!description || !String(description).trim()) {

            return res.status(400).json({ error: "A mensagem do comunicado é obrigatória." });

        }

        const resultado = await BroadcastManager.broadcast(client, {
            title,
            description,
            color,
            footer: "Comunicado enviado pelo dono do bot"
        });

        res.json(resultado);

    });

    /*
    =========================
        REINICIAR
    =========================
    */

    router.post("/restart", async (req, res) => {

        const { title, description, color } = req.body || {};

        const resultado = await BroadcastManager.restart(client, {
            title,
            description,
            color
        });

        res.json({
            ok: true,
            message: "Comunicado enviado. O processo vai encerrar em alguns segundos.",
            broadcast: resultado
        });

    });

    return router;

};
