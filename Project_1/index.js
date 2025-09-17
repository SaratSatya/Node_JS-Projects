const express = require('express');
const fs = require('fs');
let users = require('./MOCK_DATA (1).json');

const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // 👈 needed for PATCH/POST JSON body

// Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    res.send(html);
});

app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.route('/api/users/:id')
.get((req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === Number(id));
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
})
.patch((req, res) => {
    const { id } = req.params;
    const body = req.body;
    const userIndex = users.findIndex((user) => user.id === Number(id));

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // update only provided fields
    users[userIndex] = { ...users[userIndex], ...body };

    fs.writeFileSync('./MOCK_DATA (1).json', JSON.stringify(users, null, 2));

    return res.json({ status: "User updated", user: users[userIndex] });
})
.delete((req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === Number(id));

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1);

    fs.writeFileSync('./MOCK_DATA (1).json', JSON.stringify(users, null, 2));

    return res.json({ status: "User deleted", user: deletedUser[0] });
});

app.post("/api/users", (req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({ error: "Missing required user fields" }); 
    }
    const newUser = { ...body, id: users.length ? users[users.length - 1].id + 1 : 1 };
    users.push(newUser);

    fs.writeFileSync('./MOCK_DATA (1).json', JSON.stringify(users),(err,data)=>{
        return res.status(201).json({ status: "User added", user: newUser });
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
