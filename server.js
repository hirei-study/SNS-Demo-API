
const express = require("express")
require("dotenv").config()
const authRoute = require("./routes/auth")
const postsRoute = require("./routes/posts")
const usersRoute = require("./routes/user")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 10000

// app.get("/", (req, res) => {
//     res.send("Hello")
// })

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/posts", postsRoute)
app.use("/api/users", usersRoute)

app.listen(PORT, () => {
    console.log(`ポート${PORT}番でサーバー起動中...`)
})