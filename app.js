const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./router/userRouter');
const mainAdminRouter = require('./router/mainAdminRouter');
const pageUserRouter = require('./router/pageUserRouter');
const cartRouter = require('./router/cartRouter');
const favoriteRouter = require('./router/favoriteRouter')
const paymentRouter = require('./router/paymentRouter')
const path = require('path');
const flash = require('connect-flash');
const cookie = require('cookie-parser')
const https = require('https');
const { Server } = require ('socket.io');
const { onSocket } = require('./chat/onSocket');
const fs = require('fs');

let options =
    {
        key: fs.readFileSync('LAB.KEY'),
        passphrase: 'pass',
        cert: fs.readFileSync('LAB.crt')
    };

const server = https.createServer(options, app);
const io = new Server(server);
onSocket(io);

function notifyClients(message) {
    io.emit('message:receive', { message });
}

app.use(express.json());
app.use(cookie());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/auth', userRouter);
app.use('/admin', mainAdminRouter);
app.use('/user', pageUserRouter);
app.use('/user', cartRouter);
app.use('/user', favoriteRouter);
app.use('/user', paymentRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/login', (req, res) => {
    res.redirect('/admin/adminPanel');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
