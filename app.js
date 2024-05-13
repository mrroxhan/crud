// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nodejs-crud', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Schema
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    name: String,
    description: String
});
const ItemModel = mongoose.model('Item', ItemSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const items = await ItemModel.find();
    res.render('index', { items });
});

app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    const newItem = new ItemModel({ name, description });
    await newItem.save();
    res.redirect('/');
});

app.get('/items/:id/edit', async (req, res) => {
    const item = await ItemModel.findById(req.params.id);
    res.render('edit', { item });
});

app.post('/items/:id', async (req, res) => {
    const { name, description } = req.body;
    await ItemModel.findByIdAndUpdate(req.params.id, { name, description });
    res.redirect('/');
});

app.post('/items/:id/delete', async (req, res) => {
    await ItemModel.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
