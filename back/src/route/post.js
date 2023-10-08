const express = require('express')
const router = express.Router()

const { Post } = require('../class/post')

router.post('/post-create', function (req, res) {
  try {
    //! отримуємо дані
    const { username, text, postId } = req.body

    //! перевіряємо чи вони є
    if (!username || !text) {
      return res.status(400).json({
        message:
          'Потрібно передати всі дані для створення поста',
      })
    }

    let post = null

    console.log(postId, 'postId')

    if (postId) {
      post = Post.getById(Number(postId))
      console.log(post, 'post')

      if (!post) {
        return res.status(400).json({
          message: 'Пост з таким ID не існує',
        })
      }
    }

    //! newPost у нас буде або replay пост або звичайний пост.
    const newPost = Post.create(username, text, post)

    return res.status(200).json({
      //! у нашому випадку ці дані не використовуються але якщо потрібно буде вивести вспливашку що такий пост створився тоуже ці дані можна використати......
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/post-list', function (req, res) {
  try {
    const list = Post.getList()

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      list: list.map(({ id, username, text, date }) => ({
        id,
        username,
        text,
        date,
      })),
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/post-item', function (req, res) {
   try {
      const { id } = req.query

      if (!id) {
         return res.status(400).json({
            message: 'Потрібно передати ID поста',
         })
      }

      //! знаходим по id наш пост
      const post = Post.getById(Number(id))

      if (!post) {
         return res.status(400).json({
            message: 'Пост з таким ID не існує',
         })
      }

      return res.status(200).json({
         post: {
            id: post.id,
            text: post.text,
            username: post.username,
            date: post.date,

            reply: post.reply.map((reply) => ({
               id: reply.id,
               text: reply.text,
               username: reply.username,
               date: reply.date,
            }))
         }
      })
   } catch (e) {
      return res.status(400).json({
         message: e.message,
      })
   }
})

module.exports = router
