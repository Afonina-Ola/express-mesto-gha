const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../errors/url-validator');

const {
  getUsers, getUser, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', getUsers);

// обновляет профиль
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

// обновляет аватар
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidator),
  }),
}), updateUserAvatar);

// возвращает информацию о текущем пользователе
userRouter.get('/me', getUserInfo);

// возвращает пользователя по _id
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), getUser);

module.exports = userRouter;
