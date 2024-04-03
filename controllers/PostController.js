const PostModel = require('../models/Post');

const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({
        path: 'author',
        select: ['fullName', 'avatarUrl'],
      })
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Posts are not found',
    });
  }
};

const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Posts are not found',
    });
  }
};

const getOne = async (req, res) => {
  try {
    const postId = req.params.postId;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after' },
    ).then((doc, err) => {
      if (err) {
        return res.status(500).json({
          message: 'Posts can not be returned',
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Doc is not found',
        });
      }

      res.json(doc);
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({
      message: 'Post is not found',
    });
  }
};

const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imgUrl: req.body.imgUrl,
      author: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is not created',
    });
  }
};

const update = async (req, res) => {
  try {
    const postId = req.params.postId;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imgUrl: req.body.imgUrl,
        author: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is not created',
    });
  }
};

const remove = async (req, res) => {
  try {
    const postId = req.params.postId;

    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc, err) => {
      console.log(doc);
      console.log(err);
      if (err) {
        return res.status(500).json({
          message: 'Post is not updated',
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Doc is not found',
        });
      }

      res.json({
        success: true,
      });
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({
      message: 'Post is not found',
    });
  }
};

module.exports = { getAll, getTags, create, getOne, update, remove };
