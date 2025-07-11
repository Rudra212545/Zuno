const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./DB/db.js');
// const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server, {
//   cors: { origin: '*' }
// });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// Socket.IO logic
// require('./socket')(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
