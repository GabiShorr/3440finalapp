const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Temporary in-memory storage for registered users
const users = [];

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already taken' });
    }

    // Save the new user to the temporary storage (in a real app, you'd save it to a database)
    const newUser = { username, password };
    users.push(newUser);

    res.status(201).json(newUser);
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match any registered user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
