const express = require('express')
const cors = require('cors')
const moment = require('moment-timezone');

const app = express()
const PORT = process.env.PORT || 7060;

//const UserRoutes = require('./routes/user')
const AuthRoutes = require('./routes/auth')
const AdminRoutes = require('./routes/admin')
const PreJoineeRoutes = require('./routes/prejoinee')
//const HomeRoutes = require('./routes/home')
//const InfraRoutes = require('./routes/infra')


app.use('/api/auth', AuthRoutes)
//app.use('/api/user', UserRoutes)
app.use('/api/admin', AdminRoutes)
app.use('/api/prejoinee', PreJoineeRoutes)
//app.use('/api/home', HomeRoutes)
//app.use('./api/infra',InfraRoutes)

app.use(cors())
app.use(express.json());

app.use(express.static("/uploads"))

// app.use(express.static('public'));
// app.use('/image', express.static(__dirname + '/image'));

moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';



app.listen(PORT, () => {
    var datetime = moment().format('DD-MMM-YYYY, hh:mm:ss A');
    console.log('---------------')
  
    console.log('Server Manager - Admin App running on port -', PORT, datetime)
})