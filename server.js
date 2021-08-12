const express = require("express");
const app = express()
const path = require("path")

const publicPath = path.join(__dirname, './public')
app.use(express.static(publicPath))
console.log(publicPath)
const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log("your server is up")
})