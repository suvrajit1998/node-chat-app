const generateMessage = (userName,text) => {
  return {
    userName,
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (userName,text) => {
  return {
    userName,
    text,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}
