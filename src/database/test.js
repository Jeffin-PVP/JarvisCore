const GuildRepository = require("./repositories/GuildRepository");

(async () => {

    const settings = await GuildRepository.getSettings(
        "1518326828878663740"
    );

    console.log(settings);

})();