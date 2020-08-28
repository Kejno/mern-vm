const { Router } = require('express')
//импортируем модель ссылки
const Link = require('../models/Link')
//Создаю объект Routera
const router = Router()

router.get('/:code', async (req, res) => {
  try {

    //

    const link = await Link.findOne({ code: req.params.code })
    console.log(res)
    if (link) {
      link.clicks++
      await link.save()

      return res.redirect(link.from)
    }

    res.status(404).json('Ссылка не найдена')

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

module.exports = router