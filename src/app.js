const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const { PORT } = process.env

// express setup
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

// mongoose setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog-application', { useNewUrlParser: true, useUnifiedTopology: true })

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    createdAt: {type: Date, default: Date.now}
})

const Blog = mongoose.model('Blog', blogSchema)

// ROUTES
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})