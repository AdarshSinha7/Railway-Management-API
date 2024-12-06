const express = require("express");
const app = express();
const prisma = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

require('dotenv').config();



app.use(express.json());

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// Register User
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  const user = await prismaClient.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Admin for Adding Train
app.post("/admin/train", async (req, res) => {
  const { source, destination, totalSeats } = req.body;
  const apiKey = req.headers["api-key"];
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  
  try {
    const newTrain = await prismaClient.train.create({
      data: { source, destination, totalSeats },
    });
    res.status(201).json(newTrain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Getting the Train Availability
app.get("/train/availability", async (req, res) => {
  const { source, destination } = req.query;
  
  const trains = await prismaClient.train.findMany({
    where: { source, destination },
  });

  res.json(trains);
});

// Booking a Seat
app.post("/book", authenticateToken, async (req, res) => {
  const { trainId, seats } = req.body;
  const { userId } = req.user;

  const train = await prismaClient.train.findUnique({
    where: { id: trainId },
  });

  if (!train || train.totalSeats < seats) {
    return res.status(400).json({ error: "Not enough seats available" });
  }

  const booking = await prismaClient.booking.create({
    data: {
      userId,
      trainId,
      seats,
    },
  });

  await prismaClient.train.update({
    where: { id: trainId },
    data: { totalSeats: train.totalSeats - seats },
  });

  res.status(201).json(booking);
});

// Get Specific Booking Details
app.get("/book/:id", authenticateToken, async (req, res) => {
  const bookingId = req.params.id;
  const booking = await prismaClient.booking.findUnique({
    where: { id: parseInt(bookingId) },
    include: { user: true, train: true },
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  res.json(booking);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
