const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
app.use('/api', authRouter);

const userRouter = require('./routes/user');
app.use('/api/users', userRouter);

const equipmentRouter = require('./routes/equipment');
app.use('/api/equipment', equipmentRouter);

const borrowRouter = require('./routes/borrow');
app.use('/api/borrow', borrowRouter);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 