const User = require('../models/user');

const ERROR_CODES = {
  NOT_FOUND_ERROR: 404,
  ERROR_CODE: 400,
  SERVER_ERROR: 500
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODES.NOT_FOUND_ERROR).send({ message: 'Пользователь с введенным _id не найден' });
      } else { () => res.send({ data: { user: user.name, about: user.about, avatar: user.avatar, _id: user._id } }) }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.NOT_FOUND_ERROR).send({ message: 'Пользователь с введенным _id не найден' });
      } else { () => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания пользователя' });
      } else { () => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания пользователя' });
      } else { () => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания аватара пользователя' });
      } else { () => res.status(ERROR_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }) }
    });
};

