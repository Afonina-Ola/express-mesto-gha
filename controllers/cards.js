const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ErrorCode = require('../errors/error-code');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards.map(({
        createdAt, likes, link, name, owner, _id,
      }) => ({
        createdAt, likes, link, name, owner, _id,
      })),
    }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorCode('Переданы некорректные данные в методы создания карточки');
      } else { next(err); }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { })
    .populate('owner')
    .then((card) => {
      if (card.owner && card.owner.id === req.user._id) {
        card.remove()
          .then(() => {
            res.send({ data: card });
          })
          .catch(next);
      } else {
        throw new ErrorCode('Недостаточно прав для этого действия');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorCode('Веденный _id не корректен');
      } else { next(err); }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с введенным _id не найдена');
      } else { res.send({ data: card }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorCode('Веденный _id не корректен');
      } else { next(err); }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с введенным _id не найдена');
      } else { res.send({ data: card }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorCode('Веденный _id не корректен');
      } else { next(err); }
    })
    .catch(next);
};
