const jwt = require("jsonwebtoken")

// const isAuthenticated = (req, res, next) => {
    function isAuthenticated (req, res, next) {
    // split[" "][1]の意味・・・Bearer ${token}の半角スペースの部分で区切ると、[Beare, ${token}]の配列に分けることができる。その配列の1番目を取得すると言う意味。
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({message: "権限がありません。トークンがありません。"})
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if(error) {
            return res.status(401).json({message: "権限がありません。デコードの結果、元のトークンではありませんでした。"})
        }

        req.userId = decoded.id

        // next()
        return next()
    })
}

module.exports = isAuthenticated