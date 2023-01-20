const userRouter = require('express').Router();

const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', getUsers);

// возвращает пользователя по _id
userRouter.get('/:userId', getUser);

// создаёт пользователя
userRouter.post('/', createUser);

// обновляет профиль
userRouter.patch('/me', updateUser);

// обновляет аватар
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
