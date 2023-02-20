/* eslint-disable consistent-return */
/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ErrorCode = require('../errors/error-code');
const ConflictCode = require('../errors/conflict-code');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { })
    .then((user) => res.send({
      data:
      {
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь с введенным _id не найден');
      } else if (err.name === 'CastError') {
        throw new ErrorCode('Веденный _id не корректен');
      } else { next(err); }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorCode('Переданы некорректные данные в методы создания пользователя');
      } else if (err.code === 11000) {
        throw new ConflictCode('Пользователь с таким email уже существует');
      } else { next(err); }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorCode('Переданы некорректные данные в методы создания пользователя');
      } else { next(err); }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorCode('Переданы некорректные данные в методы создания аватара пользователя');
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.send({ token });
      } else { throw new UnauthorizedError('Неверный логин или пароль'); }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
