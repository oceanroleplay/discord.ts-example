import { Discord, DIService, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { container, injectable } from 'tsyringe'
import { TextChannel } from 'discord.js'

import { QuestionsDatabase } from '@app/entities/questionDb'
import { sendScoreBoard } from '@app/utils/session'
@Discord()
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChannelCommand {
  constructor(private database: QuestionsDatabase) {}

  @SimpleCommand('subscribe')
  subscribe(command: SimpleCommandMessage) {
    this.database.addChannel(command.message.channelId)

    command.message.reply({
      content: `${command.message.author} subscribed this channel`,
    })
  }

  @SimpleCommand('unsubscribe')
  unsubscribe(command: SimpleCommandMessage) {
    this.database.deleteChannel(command.message.channelId)

    command.message.reply({
      content: `${command.message.author} unsubscribe this channel`,
    })
  }

  @SimpleCommand('ranking')
  ranking(command: SimpleCommandMessage) {
    const channel = command.message.channel
    const isTextChannel = channel.isText()
    if (isTextChannel && channel) {
      sendScoreBoard(this.database.db, channel as TextChannel, command.message)
    }
  }

  // @TODO delete later
  @SimpleCommand('db')
  db(): void {
    if (DIService.container) {
      const myClass = container.resolve(ChannelCommand)
      console.log(JSON.stringify(myClass.database.db))
    }
  }
}
