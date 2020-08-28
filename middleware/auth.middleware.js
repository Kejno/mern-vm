const jwt = require('jsonwebtoken')
const config = require('config')
// middleware - по сути это обычная функция, 
// которая позволяет перехватывать определе данные и делать логику, которую мы и опишем

// next - позволяет продолжить выполнение запроса
module.exports = (req, res, next) => {

  // req.method - спец метод, который в restAPI который проверяет доступность сервера
  if (req.method === 'OPTIONS') {

    // если OPTIONS то продолжает делать запрос
    return next()
  }

  try {

    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    //Если токен есть , то на надо его раскодировать 
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded
    next()

  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }

}