const IdentIcon = require("identicon.js")
const crypt = require("crypto")

const generateIdenticon = (input, size = 64) => {
    const hash = crypt.createHash("md5").update(input).digest("hex")
    const data = new IdentIcon(hash, size).toString()

    return `data:image/png;base64, ${data}`
}

module.exports = generateIdenticon