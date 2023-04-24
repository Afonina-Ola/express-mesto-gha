const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ErrorCode = require('../errors/error-code');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ErrorCode('Переданы некорректные данные в методы создания карточки');
        next(error);
      } else { next(err); }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { })
    .populate('owner')
    .then((card) => {
      if (card.owner && card.owner.id === req.user._id) {
        card.remove()
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав для этого действия');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ErrorCode('Веденный _id не корректен');
        next(error);
      } else if (err.name === 'DocumentNotFoundError') {
        const error = new NotFoundError('Карточка с введенным _id не найдена');
        next(error);
      } else { next(err); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        const error = new NotFoundError('Карточка с введенным _id не найдена');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new ErrorCode('Веденный _id не корректен');
        next(error);
      } else { next(err); }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        const error = new NotFoundError('Карточка с введенным _id не найдена');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new ErrorCode('Веденный _id не корректен');
        next(error);
      } else { next(err); }
    });
};
