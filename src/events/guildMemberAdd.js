const { Events } = require("discord.js");

const LogManager = require("../managers/LogManager");
const LogTypes = require("../managers/LogTypes");
const AutoroleRepository = require("../database/repositories/AutoroleRepository");

module.exports = {

    name: Events.GuildMemberAdd,

    async execute(member) {

        await LogManager.send({
            type: LogTypes.MEMBER_JOIN,
            guild: member.guild,
            target: member,
            extra: {
                memberCount: member.guild.memberCount
            }
        });

        // Auto-role de entrada
        if (!member.user.bot) {

            const roleIds = await AutoroleRepository.getJoinRoles(member.guild.id);

            for (const roleId of roleIds) {

                const role = member.guild.roles.cache.get(roleId);

                if (!role) continue;

                await member.roles.add(role).catch(() => null);

            }

        }

    }

};
