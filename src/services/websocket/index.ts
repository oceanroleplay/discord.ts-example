import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { ArgsOf, Discord, DIService, On, Once, Client } from "discordx";
import { container, injectable } from "tsyringe";

import { giveAnswer } from "@app/utils/answer";
import { getWsUrl } from "@app/utils/api";
import { askQuestion } from "@app/utils/question";
import { assertNever } from "@app/utils/types";
import { endSession } from "@app/utils/session";
import { QuestionsDatabase } from "@app/entities/questionDb";
global.WebSocket = require("ws");

@Discord()
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SphinxWS {
  _socket: WebSocketSubject<WsMessages>;

  constructor(private database?: QuestionsDatabase) {
    this._socket = webSocket(getWsUrl());
  }

  get socket(): WebSocketSubject<WsMessages> {
    return this._socket;
  }

  @On("ready")
  ready(_: ArgsOf<"ready">, client: Client) {
    if (DIService.container && process.env.NODE_ENV !== "development") {
      const myClass = container.resolve(SphinxWS);
      const questionsDatabaseInstance = myClass.database!;

      return this._socket.subscribe((msg) => {
        switch (msg.type) {
          case "question":
            return askQuestion(questionsDatabaseInstance, msg.data, client);
          case "answer":
            return giveAnswer(questionsDatabaseInstance, msg.data, client);
          case "game_end":
            return endSession(questionsDatabaseInstance, client);
          default:
            assertNever(msg);
        }
      });
    }
  }
}

export { SphinxWS };
