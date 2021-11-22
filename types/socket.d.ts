type WsMessagesTypes = 'question' | 'answer' | 'game_end'

declare interface QuestionWsMessage {
  type: Extract<WsMessagesTypes, 'question'>
  data: QuestionDataType
}

declare interface AnswerWsMessage {
  type: Extract<WsMessagesTypes, 'answer'>
  data: AnswerDataType
}

declare interface GameEndWsMessage {
  type: Extract<WsMessagesTypes, 'game_end'>
  data: {}
}

type WsMessages = QuestionWsMessage | AnswerWsMessage | GameEndWsMessage
