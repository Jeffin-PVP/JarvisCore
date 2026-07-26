const GuildRepository = require("./repositories/GuildRepository");

(async () => {

    await GuildRepository.setLogChannel({
        guildId: "1482846394233389148",
        channelId: "1526647280487108649"
    });

    const settings = await GuildRepository.getSettings("1482846394233389148");

    console.log(settings);

})();