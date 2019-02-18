const tUM = require('../lib/tUM.js');
const loadAlias = require('../lib/loadAlias.js');
const loadConfig = require('../lib/loadConfig.js');

//Waiting for messages
module.exports = async (client, oldMember, newMember) => {
    //Do not read bot updates.
    if (newMember.user.bot) return;
    //Update does not refer to a game change.
    if (newMember.presence.game == null) return;
    //Not in a voiceChannel
    if (newMember.voiceChannelID == null) return;
    //Does not move while the user changes status.
    if (oldMember.presence.status != newMember.presence.status) return;

    //Load config
    data = {}
    data.guild = newMember.guild
    //console.log(data)
    loadConfig(data, client.dbGuild, function (config) {

        users = config.users;

        if (typeof config.users == "undefined") {
            //No data means no users active presence mover.
            return;
        }
        //console.log(config);
        if (users[newMember.id] == null || users[newMember.id] == false) {
            //Send message to enable presenceupdater.
            //Send to user but enable in guild.
            return;
        }

        loadAlias(data, client.dbGuild, function (alias) {
            gamename = newMember.presence.game.name.toLowerCase();
            newChannelId = "";

            for (var key in alias) {
                if (alias[key].includes(gamename)) {
                    newChannelId = key;
                    break;
                }
            }
            if (newChannelId == "") {
                //No channel found.
                return;
            }
            if (newMember.voiceChannelID == newChannelId) {
                //Already in right channel
                return;
            }
            newChannel = newMember.guild.channels.find(val => val.id === newChannelId);
            newMember.setVoiceChannel(newChannel.id);
            tUM(client, 1);
        });
    });
}