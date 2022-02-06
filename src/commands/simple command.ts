import { CommandInteraction, Message } from "discord.js";
import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
  Slash,
} from "discordx";

@Discord()
class simpleCommandExample {
  @SimpleCommand("hello", { aliases: ["hi"] })
  hello(command: SimpleCommandMessage) {
    command.message.reply(`👋 ${command.message.member}`);
  }

  @SimpleCommand("sum", { argSplitter: "+" })
  sum(
    @SimpleCommandOption("num1", { type: "NUMBER" }) num1: number | undefined,
    @SimpleCommandOption("num2", { type: "NUMBER" }) num2: number | undefined,
    command: SimpleCommandMessage
  ) {
    if (!num1 || !num2) {
      return command.sendUsageSyntax();
    }
    command.message.reply(`total = ${num1 + num2}`);
  }

  // make single handler for simple and slash command
  likeit(command: CommandInteraction | Message) {
    command.reply(`I like it, Thanks`);
  }

  @SimpleCommand("likeit")
  simpleLikeit(command: SimpleCommandMessage) {
    this.likeit(command.message);
  }

  @Slash("likeit")
  slashLikeit(command: CommandInteraction) {
    this.likeit(command);
  }
}
