import "reflect-metadata";
import { container } from "tsyringe";
import { Intents } from "discord.js";
import { Client, DIService } from "discordx";
import dotenv from "dotenv";

import { getBotToken } from "@app/utils/api";

import path from "path";

dotenv.config();
global.WebSocket = require("ws");

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    DIService.container = container;

    console.log("Starting bot 1 ...", process.env, process.env.NODE_ENV);

    this._client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
      classes: [
        path.join(__dirname, "commands", "**/*.{ts,js}"),
        path.join(__dirname, "entities", "**/*.{ts,js}"),
        path.join(__dirname, "services", "**/*.{ts,js}"),
        path.join(__dirname, "utils", "**/*.{ts,js}"),
      ],
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      silent: true,
      simpleCommand: {
        prefix: "/spx ",
        responses: {
          notFound: "Command not found, use /spx help",
          unauthorised: (command) => {
            if (command.message.channel.type === "DM") {
              command.message.reply(
                "Do you have permission to access this command?"
              );
              return;
            }

            // let's have different message for guild command
            command.message.reply(
              `${command.message.member} you are not authorized to access ${command.prefix}${command.name} command`
            );
            return;
          },
        },
      },
    });

    this._client.on("ready", async () => {
      console.log(">> Bot started");

      await this._client.initApplicationCommands();
      await this._client.initApplicationPermissions();
    });

    console.log("Starting bot 2 ...", getBotToken());

    await this._client.login(getBotToken());
  }
}

(async () => await Main.start())();
