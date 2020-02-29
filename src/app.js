const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
dotenv.config()
const { PORT } = process.env

// express setup
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))

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
    res.redirect('/posts')
})

//  index route
app.get('/posts', (req, res) => {
    Blog.find({}, (error, posts) => {
        if (error) {
            res.status(400).send('404 - Posts not found')
        }

        res.render('index', {posts})
    })
})

// create routes
app.get('/posts/new', (req, res) => {
    res.render('new')
})

app.post('/posts', (req, res) => {
    Blog.create(req.body.post, (error, newPost) => {
        if (error) {
            res.render('new')
        }

        res.redirect('/posts')
    })
})

// show full post
app.get('/posts/:id', (req, res) => {
    Blog.findById(req.params.id, (error, post) => {
        if(error) {
            res.redirect('/posts')
        }
        res.render('show', {post})
    })
})

// edit post
app.get('/posts/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (error, post) => {
        if(error) {
            res.redirect('/posts')
        }

        res.render('edit', {post})
    })
})

// update post
app.put('/posts/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.post, (error, updatedPost) => {
        if (error) {
            res.redirect('/posts')
        }

        res.redirect(`/posts/${req.params.id}`)
    })
})

// delete post
app.delete('/posts/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (error, deletedPost) => {
        if (error) {
            res.redirect('/posts')
        }

        res.redirect('/posts')
        console.log(deletedPost)
    })
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})