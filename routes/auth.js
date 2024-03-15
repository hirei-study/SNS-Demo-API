const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const generateIdenticon = require("../utils/generateIdenticon")
const router = require("express").Router()
require("dotenv").config()

const KEY = process.env.SECRET_KEY
const prisma = new PrismaClient()

// 新規ユーザー作成API
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    const defaultIconImage = generateIdenticon(email)
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
            profile: {
                create: {
                    bio: "はじめまして",
                    profileImageUrl: defaultIconImage
                }
            }
        },
        include: {
            profile: true
        }
    })
    return res.status(201).json({user})
    } catch (error) {
        console.log("エラーです。: ", error)
        return res.status(500).json({error: error})
    }
})

// ユーザーログインAPI
router.post("/login", async (req, res) => {
    const {email, password} = req.body
    const user = await prisma.user.findUnique({where: {email}})

    if(!user) {
        return res.status(401).json({error: "そのようなユーザーは存在しません。メールアドレスを確かめてください。"})
    }

    // ハッシュ化されたパスワードの照合・復元
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({error: "パスワードが間違っています。"})
    }

    const token = jwt.sign({id: user.id}, KEY, {
        expiresIn: "1d"
    })

    return res.status(200).json({token})
})

module.exports = router