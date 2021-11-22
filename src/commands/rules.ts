import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

@Discord()
export abstract class ChannelCommand {
  @SimpleCommand('rules', { aliases: ['r'] })
  rules(command: SimpleCommandMessage) {
    command.message.author.send('We need to write a description for the rules')
  }
}
