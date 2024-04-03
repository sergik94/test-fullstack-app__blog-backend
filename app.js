const express = require('express');
const mg = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const Validations = require('./utils/validations');
const checkAuth = require('./utils/checkAuth');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const handleValidationErrors = require('./utils/handleValidationErrors');

mg.connect(
  'mongodb+srv://sergeynikolin:12345678Hh@cluster0.jhoh2wh.mongodb.net/blog',
)
  .then(() => console.log('DB is ok'))
  .catch((err) => {
    console.log('Errrror', err);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());

app.post(
  '/auth/signin',
  Validations.signIn,
  handleValidationErrors,
  UserController.signIn,
);
app.post(
  '/auth/signup',
  Validations.signUp,
  handleValidationErrors,
  UserController.signUp,
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.use('/uploads', express.static('uploads'));

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getTags);
app.get('/posts/:postId', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  Validations.createPost,
  handleValidationErrors,
  PostController.create,
);
app.patch(
  '/posts/:postId',
  Validations.createPost,
  handleValidationErrors,
  checkAuth,
  PostController.update,
);
app.delete('/posts/:postId', checkAuth, PostController.remove);

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log('Server OK');
});
