import { Discord, DIService, SimpleCommand } from 'discordx'
import { container, injectable } from 'tsyringe'

import { giveAnswer } from '@app/utils/answer'
import { askQuestion } from '@app/utils/question'
import { endSession } from '@app/utils/session'
import { QuestionsDatabase } from '@app/entities/questionDb'
import { Main } from '@app/index'
@Discord()
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CommandTest {
  constructor(private database: QuestionsDatabase) {}

  @SimpleCommand('test')
  test() {
    if (DIService.container) {
      const myClass = container.resolve(CommandTest)
      const questionsDatabaseInstance = myClass.database

      const question: QuestionDataType = {
        question: {
          id: 3,
          type: 'round_winner',
          text: 'Team Liquid vs LNG Esports is about to start! Who do you think will win?',
          expiration_in_seconds: 30,
          possible_answers: ['TL', 'LNG'],
        },
      }

      const answer: AnswerDataType = {
        answer: {
          question_id: 3,
          value: 'TL',
          text: 'TL won the game',
        },
      }

      askQuestion(questionsDatabaseInstance, question, Main.Client)

      setTimeout(() => {
        giveAnswer(questionsDatabaseInstance, answer, Main.Client)
      }, 30000)

      setTimeout(() => {
        endSession(questionsDatabaseInstance, Main.Client)
      }, 35000)
    }
  }
}
