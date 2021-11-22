import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

@Discord()
export abstract class commandPing {
  @SimpleCommand('ping')
  async answer(command: SimpleCommandMessage) {
    command.message.reply('pong')
  }
}
