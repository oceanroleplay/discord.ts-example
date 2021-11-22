import { MessageEmbed } from "discord.js";
import { Client } from "discordx";

import { tagUsers } from "@app/utils/message";
import { QuestionsDatabase } from "@app/entities/questionDb";

import { getQuestionIndex } from "./question";

const giveAnswer = (
  questionsDBInstance: QuestionsDatabase,
  data: AnswerDataType,
  client: Client
) => {
  const { question_id, value, text } = data.answer;

  const questionsData = questionsDBInstance.db;

  questionsData.forEach((channelFromDb) => {
    const channelFromDiscord = client.channels.cache.get(channelFromDb.id);
    const isTextChannel = channelFromDiscord?.isText();

    if (isTextChannel && channelFromDiscord) {
      const channelIndex = questionsDBInstance.getChannelIndex(
        channelFromDb.id
      );

      if (channelIndex !== -1) {
        const questions = questionsData[channelIndex].questions;
        const questionIndex = getQuestionIndex(question_id, questions);

        const answerIndex =
          questions[questionIndex]?.possible_answers?.findIndex(
            (possibility) => possibility === value
          ) ?? -1;

        const winners = questions[questionIndex]?.answers?.[answerIndex] ?? [];

        questionsDBInstance.addWinner(channelFromDb.id, question_id, winners);

        const answerMessage =
          winners.length > 0
            ? `${text} - Congrats ${tagUsers(
                winners
              )} on getting the correct answer`
            : `${text} - Nobody got it right...`;

        const embed = new MessageEmbed()
          .setColor("#DB47FF")
          .setTitle(":medal: Poll is over!")
          .setDescription(answerMessage);

        channelFromDiscord.send({
          embeds: [embed],
          reply: {
            messageReference: channelFromDiscord.lastMessageId ?? "",
            failIfNotExists: true,
          },
        });
      }
    }
  });
};

export { giveAnswer };
