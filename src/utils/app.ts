import { ArgsOf, Client, Discord, On } from 'discordx'

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AppDiscord {
  @On('ready')
  ready(_: ArgsOf<'ready'>, client: Client) {
    console.log('ready !!!!!!!!!!!')
    // await client.initApplicationCommands({
    //   guild: { log: true },
    //   global: { log: true },
    // })
    // await client.initApplicationPermissions()

    client.user?.setStatus('dnd')
    client.user?.setActivity('Looking a CSGO match')

    console.log('Bot is running ✅')
  }

  @On('interactionCreate')
  private interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
    client.executeInteraction(interaction)
  }

  @On('messageCreate')
  private messageCreate([message]: ArgsOf<'messageCreate'>, client: Client) {
    client.executeCommand(message)
  }
}
