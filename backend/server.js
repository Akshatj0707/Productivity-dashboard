require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { connectDB } = require('./db');
const routes     = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy:false, crossOriginEmbedderPolicy:false }));
app.use(cors({ origin:'*', methods:['GET','POST','PUT','DELETE'], allowedHeaders:['Content-Type','Authorization'] }));
app.use(rateLimit({ windowMs:15*60*1000, max:600 }));
app.use('/api/auth', rateLimit({ windowMs:15*60*1000, max:30, message:{ error:'Too many requests' } }));
app.use(express.json({ limit:'10mb' }));
app.use(morgan('dev'));

app.use('/api', routes);

const frontend = path.join(__dirname, '../frontend/public');
app.use(express.static(frontend));
app.get('*', (req,res) => {
  if (!req.path.startsWith('/api')) res.sendFile(path.join(frontend,'index.html'));
  else res.status(404).json({ error:'Not found' });
});

app.use((err,req,res,next) => {
  res.status(err.status||500).json({ error: err.message||'Server error' });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log('\n============================================');
    console.log('  Executive Flow Server Started');
    console.log('============================================');
    console.log('  URL:   http://localhost:' + PORT);
    console.log('  API:   http://localhost:' + PORT + '/api/health');
    console.log('\n  Demo Login:');
    console.log('  Admin: admin@executiveflow.io / admin123');
    console.log('  User:  alex@acme.com / user123\n');
  });
}
start();
