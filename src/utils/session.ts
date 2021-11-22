import { Message, TextChannel } from 'discord.js'
import { Client } from 'discordx'

import { getEmojiFromPlace, tagUsers } from '@app/utils/message'
import { QuestionsDatabase } from '@app/entities/questionDb'

const getWinners = (channelId: string, channels: QuestionDbType): Winners => {
  const channelIndex = channels.findIndex(item => item.id === channelId)

  const channelExist = channelIndex >= 0

  if (!channelExist) {
    return []
  }

  return Object.entries(
    channels[channelIndex].questions.reduce(
      (
        users: {
          [key: string]: number
        },
        question: QuestionItem,
      ) => {
        if (question.winners) {
          question?.winners.forEach((winnerId: string) => {
            users[winnerId] = users[winnerId] ? users[winnerId] + 1 : 1
          })
        }
        return users
      },
      {},
    ),
  )
    .sort((user1, user2) => user2[1] - user1[1])
    .reduce(
      (
        wins: {
          score: number
          users: string[]
        }[],
        user,
      ) => {
        if (wins.length >= 1 && wins[wins.length - 1].score === user[1]) {
          wins[wins.length - 1].users.push(user[0])
        } else {
          wins.push({ score: user[1], users: [user[0]] })
        }
        return wins
      },
      [],
    )
    .slice(0, 3)
}

const endSession = (questions: QuestionsDatabase, client: Client) => {
  const questionsData = questions.db

  questionsData.forEach(channelFromDb => {
    const channelFromDiscord = client.channels.cache.get(channelFromDb.id)
    const isTextChannel = channelFromDiscord?.isText()

    if (isTextChannel && channelFromDiscord) {
      const usersWins = getWinners(channelFromDb.id, questionsData)

      const usersWinsMessage = usersWins.map((usersAndScore, index: number) => {
        return `${getEmojiFromPlace(index)} ${tagUsers(usersAndScore.users)} for ${
          usersAndScore.score
        } correct answers`
      })

      const message = `Congratulations to:\n${usersWinsMessage.join('\n')}`

      if (usersWins.length >= 1) {
        channelFromDiscord.send(message)
      }
    }
  })
}

const sendScoreBoard = (
  questions: QuestionDbType,
  channel: TextChannel,
  messageToReply: Message,
) => {
  const usersWins = getWinners(channel.id, questions)

  const usersWinsMessage = usersWins.map((usersAndScore, index: number) => {
    return `${getEmojiFromPlace(index)} ${tagUsers(usersAndScore.users)} for ${
      usersAndScore.score
    } correct answers`
  })

  const message = `Congratulations to:\n${usersWinsMessage.join('\n')}`

  if (usersWins.length >= 1) {
    channel.send({
      content: message,
      reply: {
        messageReference: messageToReply,
        failIfNotExists: true,
      },
    })
  } else {
    channel.send({
      content: 'No one is ranked on current game',
      reply: {
        messageReference: messageToReply,
        failIfNotExists: true,
      },
    })
  }
}

export { endSession, getWinners, sendScoreBoard }
