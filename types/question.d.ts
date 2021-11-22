type QuestionType = 'round_winner' | 'bomb_planted'

declare interface QuestionDataType {
  question: {
    id: number
    type: QuestionType
    text: string
    possible_answers: string[] | boolean[] | boolean[]
    expiration_in_seconds: number
  }
}

declare interface QuestionItem {
  id: number
  question: string
  possible_answers?: string[] | boolean[]
  answers?: string[][]
  winners?: string[]
  info?: string
}
