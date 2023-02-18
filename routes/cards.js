const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../errors/url-validator');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardRouter.get('/', getCards);

// создаёт карточку
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom(urlValidator),
  }),
}), createCard);

// удаляет карточку по идентификатору
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required(),
  }).unknown(true),
}), deleteCard);

// поставить лайк карточке
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required(),
  }).unknown(true),
}), likeCard);

// убрать лайк с карточки
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required(),
  }).unknown(true),
}), dislikeCard);

module.exports = cardRouter;
