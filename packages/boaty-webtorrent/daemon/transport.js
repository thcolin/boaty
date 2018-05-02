module.exports = {
  encode: (action = { type: 'undefined' }) => JSON.stringify(action),
  decode: (payload) => JSON.parse(payload)
}
