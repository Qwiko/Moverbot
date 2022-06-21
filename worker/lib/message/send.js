module.exports = (bot, message, interaction, msg) => {
  if (message) {
    return bot.client.channel.createMessage(message.channel_id, {
      content: msg,
      message_reference: {
        message_id: message.id,
        channel_id: message.channel_id,
        guild_id: message.guild_id,
        fail_if_not_exists: false,
      },
    });
  }

  if (interaction) {
    var { id, token } = interaction;
    return bot.client.interaction.createInteractionResponse(id, token, {
      type: 4,
      data: { content: msg },
    });
  }
};
