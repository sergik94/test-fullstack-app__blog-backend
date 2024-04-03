const mg = require('mongoose');

const PostScheme = new mg.Schema(
  {
    title: {
      required: true,
      type: String,
      unique: true,
    },

    text: {
      required: true,
      type: String,
    },

    tags: {
      type: Array,
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mg.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imgUrl: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mg.model('Post', PostScheme);
