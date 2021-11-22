const getApiUrl = (endpoint: string) => {
  if (process.env.API_URL) {
    return `${process.env.API_URL}${endpoint}`
  }

  return endpoint
}
const getWsUrl = () => process.env.WS_URL ?? ''
const getBotToken = () => process.env.BOT_TOKEN ?? ''
const getHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
})

export { getApiUrl, getWsUrl, getBotToken, getHeaders }
