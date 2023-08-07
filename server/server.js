const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors')
const jwt = require('jsonwebtoken');

const app = express();

const bcrypt = require("bcrypt")
const saltRounds = 10

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { username },
      select:{
        password : true
      } 
    });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { user_id: user.id, username: user.username },
        "SECRET",
        {
          expiresIn: "2h",
        }
      );
      res.json({ message: 'Login successful' , token});
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});
app.get("/", async (req, res) => {
  res.status(200).send({message:"Success"})
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body  
  const hashedPassword = await bcrypt.hash(password,saltRounds )
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    })
    res.status(200).json({ data:user})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.listen(8888, () => {
  console.log('Server is running on port http://localhost:8888');
});
