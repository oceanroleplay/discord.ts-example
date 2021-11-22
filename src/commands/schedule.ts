import fetch from 'node-fetch'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { MessageEmbed } from 'discord.js'

import { getApiUrl, getHeaders } from '@app/utils/api'

@Discord()
export abstract class commandPing {
  @SimpleCommand('schedule', { aliases: ['planning', 'calendar'] })
  async schedule(
    // We will need to pass videogameslug when we will have multiple videogame
    // @SimpleCommandOption('videogame', { type: 'STRING' }) videogame: VideogameSlug,
    command: SimpleCommandMessage,
  ) {
    const scheduleData: ScheduleHTTPBody = await fetch(getApiUrl('/schedule'), {
      headers: getHeaders(),
    })
      .then(response => response.json())
      .catch(e => console.log('error', e))

    const embed = new MessageEmbed().setColor('#DB47FF').setDescription(scheduleData.data)

    command.message.reply({
      embeds: [embed],
    })
  }
}
