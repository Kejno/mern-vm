const { Router } = require('express')
const Link = require('../models/Link')
const config = require('config')
const shortid = require('shortid')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', auth, async (req, res) => {
  try {

    const baseUrl = config.get('baseUrl')

    //наша ссылка
    const { from } = req.body

    const code = shortid.generate()

    // посмотреть , есть ли уже такая ссылка в базе
    const existing = await Link.findOne({ from })
    if (existing) {
      return res.json({ link: existing })
    }

    const to = baseUrl + '/t/' + code

    const link = new Link({
      code, to, from, owner: req.user.userId
    })

    //после создания ссылки, мы ее сохраняем
    await link.save()

    res.status(201).json({ link })

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

// get запрос для получения всех ссылок
router.get('/', auth, async (req, res) => {
  try {

    // жду пока модель Link найдем мне все ссылки, которые относятся к текущему пользователю
    const links = await Link.find({ owner: req.user.userId })
    res.json(links)

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

//// get запрос для получения ссылки по id
router.get('/:id', auth, async (req, res) => {
  try {
    // жду пока модель Link найдем мне все ссылки, которые относятся к текущему пользователю
    const link = await Link.findById(req.params.id) //??????
    res.json(link)

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

module.exports = router