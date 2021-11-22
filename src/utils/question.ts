import { Message, MessageReaction, User } from "discord.js";
import { Client } from "discordx";

import {
  REGIONAL_INDICATOR_A,
  REGIONAL_INDICATOR_B,
} from "@app/constants/answers";
import { QuestionsDatabase } from "@app/entities/questionDb";

const askQuestion = (
  questionsDBInstance: QuestionsDatabase,
  data: QuestionDataType,
  client: Client
) => {
  const { possible_answers, id, text, expiration_in_seconds } = data.question;
  const questionMessage =
    possible_answers.length === 2
      ? `${text}\n\n:alarm_clock: Poll will timeout in ${expiration_in_seconds}s`
      : possible_answers.join(", ");

  questionsDBInstance.addQuestion(id, questionMessage, possible_answers);

  questionsDBInstance.db.forEach((channelFromDb) => {
    const channel = client.channels.cache.get(channelFromDb.id);
    const isTextChannel = channel?.isText();

    if (isTextChannel && channel) {
      channel
        .send({ content: questionMessage })
        .then((message: Message) => {
          message.react(REGIONAL_INDICATOR_A);
          message.react(REGIONAL_INDICATOR_B);

          const collector = message.createReactionCollector({
            time: expiration_in_seconds * 1000,
          });
          collector.on("collect", (reaction: MessageReaction, user: User) => {
            if (user.bot) {
              return;
            }

            reaction.message.reactions.cache.map((x) => {
              if (
                x.emoji.name !== reaction.emoji.name &&
                x.users.cache.has(user.id)
              )
                x.users.remove(user.id);
            });

            if (reaction.emoji.name === REGIONAL_INDICATOR_A) {
              questionsDBInstance.addUserAnswer(channel.id, id, user, "A");
            } else if (reaction.emoji.name === REGIONAL_INDICATOR_B) {
              questionsDBInstance.addUserAnswer(channel.id, id, user, "B");
            }
          });

          collector.on("end", () => {
            message.edit({
              content: `${text}\n\n:alarm_clock: Poll is closed`,
              components: [],
            });
          });
        })
        .catch((e) => console.log(e));
    }
  });
};

function doesQuestionExist(questionId: number, questions: QuestionItem[]) {
  if (questions.find((item) => item.id === questionId)) {
    return true;
  }

  return false;
}

function getQuestionIndex(questionId: number, questions: QuestionItem[]) {
  return questions.findIndex((item) => item.id === questionId);
}

export { askQuestion, doesQuestionExist, getQuestionIndex };
