const Card = require('../models/card');

const ERROR_CODES = {
  NOT_FOUND_ERROR: 404,
  ERROR_CODE: 400,
  SERVER_ERROR: 500
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({
      data: cards.map(({ createdAt, likes, link, name, owner, _id }) => {
        return { createdAt, likes, link, name, owner, _id }
      })
    }))
    .catch(() => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания карточки' });
      } else { res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.NOT_FOUND_ERROR).send({ message: 'Карточка с введенным _id не найдена' });
      } else { res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODES.ERROR_CODE).send({ message: 'Пользователь с введенным _id не найден' });
      } else { res.send({ data: card }) }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.NOT_FOUND_ERROR).send({ message: 'Карточка с введенным _id не найдена' });
      } else { res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.NOT_FOUND_ERROR).send({ message: 'Карточка с введенным _id не найдена' });
      } else { res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

// .then(card => res.send({ data: card }))