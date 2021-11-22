import fetch from 'node-fetch'
import {
  Discord,
  Permission,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from 'discordx'

import { getApiUrl, getHeaders } from '@app/utils/api'

@Discord()
@Permission(false)
// Flora
@Permission({ id: '148524810253631488', type: 'USER', permission: true })
// Matthieu
@Permission({ id: '251766208305561612', type: 'USER', permission: true })
// FX
@Permission({ id: '146334594080309248', type: 'USER', permission: true })
// Nico
@Permission({ id: '748164889586958436', type: 'USER', permission: true })
// Alexis
@Permission({ id: '889460154498699264', type: 'USER', permission: true })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SuperAdminCommands {
  @SimpleCommand('list-match', { aliases: ['l-m'] })
  async listMatch(command: SimpleCommandMessage) {
    const listOfMatchIds: ListOfMatchIdsHTTPBody = await fetch(getApiUrl(`/matches/bamboo-ws`))
      .then(response => response.json())
      .catch(e => command.message.reply(`An error happen :\n${e}`))

    if (listOfMatchIds.length >= 1) {
      command.message.reply(
        `Sphinx is currently listening to those match ids : ${listOfMatchIds.join(', ')}`,
      )
    } else {
      command.message.reply('Sphinx is not listening to any matches right now')
    }
  }

  @SimpleCommand('add-match', { aliases: ['a-m'] })
  async addMatch(
    @SimpleCommandOption('matchid', { type: 'STRING' }) matchId: string,
    command: SimpleCommandMessage,
  ) {
    if (!matchId) {
      command.sendUsageSyntax()
    } else {
      await fetch(getApiUrl(`/matches/${matchId}/bamboo-ws`), {
        method: 'PUT',
        headers: getHeaders(),
      })
        .then(() => command.message.reply(`Sphinx will now listen this match id : ${matchId}`))
        .catch(e => command.message.reply(`An error happen :\n${e}`))
    }
  }

  @SimpleCommand('remove-match', { aliases: ['r-m'] })
  async removeMatch(
    @SimpleCommandOption('matchid', { type: 'STRING' }) matchId: string,
    command: SimpleCommandMessage,
  ) {
    if (!matchId) {
      command.sendUsageSyntax()
    } else {
      await fetch(getApiUrl(`/matches/${matchId}/bamboo-ws`), {
        method: 'DELETE',
        headers: getHeaders(),
      })
        .then(() => command.message.reply(`Sphinx will now ignore this match id : ${matchId}`))
        .catch(e => command.message.reply(`An error happen :\n${e}`))
    }
  }
}
