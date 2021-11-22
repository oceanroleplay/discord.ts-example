import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

@Discord()
export abstract class ChannelCommand {
  @SimpleCommand('help', { aliases: ['h'] })
  help(command: SimpleCommandMessage) {
    command.message.author.send('We need to write a description for this command')
  }
}
