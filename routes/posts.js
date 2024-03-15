const { PrismaClient } = require("@prisma/client")
const isAuthenticated = require("../middlewares/isAuthenticated")
const router = require("express").Router()
require("dotenv").config()

const prisma = new PrismaClient()

// 呟き投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "投稿内容がありません。" });
    }

    const newPost = await prisma.post.create({
      data: {
        content: content,
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      },
    });

    return res.status(201).json({ newPost });
  } catch (error) {
    console.log("エラーです。: ", error);
    return res.status(500).json({ error: error });
  }
});

// 最新呟き取得用API
router.get("/get_latest_posts", async (req, res) => {
    try {
        const latestPosts = await prisma.post.findMany({take: 10, orderBy: {createdAt: "desc"}, include: {
            author: {
              include: {
                profile: true
              }
            }
        }})
        return res.status(200).json(latestPosts)
    } catch (error) {
        console.log("エラーです。 : ", error)
        return res.status(500).json({message: "サーバーエラーです。"})
    }
})

// 閲覧しているユーザーの投稿内容だけを取得するAPI
router.get("/:userId", async (req, res) => {
  const {userId} = req.params

  try {
    const userPost = await prisma.post.findMany({where: {
      authorId: parseInt(userId)
    },
    orderBy: {
      createdAt: "desc"
    },
  include: {
    author: true
  }})

  return res.status(200).json(userPost)

  } catch(error) {
    console.log("エラーです。 : ", error)
    return res.status(500).json({message: "サーバーエラーです。"})
  }
})

module.exports = router