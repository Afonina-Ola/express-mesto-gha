const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../errors/url-validator');

const {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardRouter.get('/', getCards);

// создаёт карточку
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(urlValidator).required(),
  }),
}), createCard);

// удаляет карточку по идентификатору
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), deleteCard);

// поставить лайк карточке
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), likeCard);

// убрать лайк с карточки
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), dislikeCard);

module.exports = cardRouter;
