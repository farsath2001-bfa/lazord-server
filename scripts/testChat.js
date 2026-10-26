// Checks that the Anthropic key in .env works.   Run from lazord-server:   node scripts/testChat.js
require('dotenv').config()

const run = async () => {
  const key = process.env.ANTHROPIC_API_KEY
  const model = process.env.CHAT_MODEL || 'claude-haiku-5-5'
  console.log('Key found in .env:', Boolean(key), key ? `(${key.trim().length} characters)` : '')
  if (!key) return
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key.trim(), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 20, messages: [{ role: 'user', content: 'Say hi' }] })
  })
  const body = await r.text()
  console.log('Model:', model)
  console.log('Status:', r.status)
  console.log(body.slice(0, 400).split(key.trim()).join('[KEY]'))
}

run().catch(e => console.log('Could not reach Anthropic:', e.message, e.cause && e.cause.code ? `(${e.cause.code})` : ''))
