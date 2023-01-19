const cardRouter = require('express').Router();

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
//возвращает все карточки
cardRouter.get('/', getCards);

//создаёт карточку
cardRouter.post('/', createCard);

//удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCard);

//поставить лайк карточке
cardRouter.put('/:cardId/likes', likeCard);

//убрать лайк с карточки
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;