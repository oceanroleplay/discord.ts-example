import { User } from 'discord.js'
import { singleton } from 'tsyringe'

import { doesQuestionExist, getQuestionIndex } from '@app/utils/question'

// We declare QuestionsDatabase as singleton to inject one instance of this class into @Discord
@singleton()
class QuestionsDatabase {
  private _database: QuestionDbType

  constructor() {
    this._database = []
  }

  get db() {
    return this._database
  }

  addWinner(channelId: string, questionId: number, winners: string[]) {
    const channelIndex = this.getChannelIndex(channelId)
    const channelExist = this.doesChannelExist(channelId)

    if (!channelExist) {
      return
    }

    const questions = this._database[channelIndex].questions
    const questionIndex = getQuestionIndex(questionId, questions)

    questions[questionIndex] = {
      ...questions[questionIndex],
      winners,
    }
  }

  addChannel(channelId: string) {
    const channelExist = this.doesChannelExist(channelId)

    if (!channelExist) {
      this._database.push({
        id: channelId,
        questions: [],
      })
    }
  }

  deleteChannel(channelId: string) {
    const channelIndex = this._database.findIndex(item => item.id === channelId)

    if (channelIndex >= 0) {
      this._database.splice(channelIndex, 1)
    }
  }

  getChannelIndex(channelId: string): number {
    const channelIndex = this._database.findIndex(item => item.id === channelId)
    return channelIndex
  }

  doesChannelExist(channelId: string) {
    const channelIndex = this.getChannelIndex(channelId)
    const channelExist = channelIndex >= 0

    return channelExist
  }

  addQuestion(
    questionId: number,
    questionMessage: string,
    possible_answers: string[] | boolean[] | undefined,
  ) {
    this._database.map(channel => {
      if (doesQuestionExist(questionId, channel.questions)) {
        const index = getQuestionIndex(questionId, channel.questions)

        if (index !== -1) {
          channel.questions[index] = {
            id: questionId,
            question: questionMessage,
            possible_answers,
            answers: [[], []],
          }
        }
      } else {
        channel.questions.push({
          id: questionId,
          question: questionMessage,
          possible_answers,
          answers: [[], []],
        })
      }

      return channel
    })
  }

  addUserAnswer(channelId: string, questionId: number, user: User, answer: 'A' | 'B') {
    const channelIndex = this.getChannelIndex(channelId)
    const channelExist = this.doesChannelExist(channelId)

    if (!channelExist) {
      return
    }

    const questions = this._database[channelIndex].questions

    const questionIndex = getQuestionIndex(questionId, questions)
    if (
      questionIndex !== -1 &&
      questions[questionIndex] &&
      questions[questionIndex].answers &&
      questions[questionIndex].answers?.[0] &&
      questions[questionIndex].answers?.[0] &&
      !questions[questionIndex].answers?.[0].find(userId => userId === user.id) &&
      answer === 'A'
    ) {
      questions[questionIndex].answers?.[0].push(user.id)

      const answerIndex = questions[questionIndex].answers?.[1].findIndex(
        userId => userId === user.id,
      )
      if (answerIndex !== undefined && answerIndex !== -1) {
        questions[questionIndex].answers?.[1].splice(answerIndex, 1)
      }
    }

    if (
      questionIndex !== -1 &&
      questions[questionIndex] &&
      questions[questionIndex].answers &&
      questions[questionIndex].answers?.[1] &&
      questions[questionIndex].answers?.[1] &&
      !questions[questionIndex].answers?.[1].find(userId => userId === user.id) &&
      answer === 'B'
    ) {
      questions[questionIndex].answers?.[1].push(user.id)

      const answerIndex = questions[questionIndex].answers?.[0].findIndex(
        userId => userId === user.id,
      )
      if (answerIndex !== undefined && answerIndex !== -1) {
        questions[questionIndex].answers?.[0].splice(answerIndex, 1)
      }
    }
  }

  clear() {
    this._database = []
  }
}

export { QuestionsDatabase }
