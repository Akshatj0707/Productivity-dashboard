require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_USERNAME')) { console.log('Set MONGODB_URI in .env first'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  const User         = require('./models/User');
  const Task         = require('./models/Task');
  const Goal         = require('./models/Goal');
  const Integration  = require('./models/Integration');
  const ApiKey       = require('./models/ApiKey');
  const AuditLog     = require('./models/AuditLog');
  const Notification = require('./models/Notification');

  await Promise.all([User,Task,Goal,Integration,ApiKey,AuditLog,Notification].map(M=>M.deleteMany({})));
  console.log('Cleared existing data');

  const admin = await User.create({ name:'Sarah Admin',  email:'admin@executiveflow.io', password:await bcrypt.hash('admin123',10), role:'admin',    plan:'Enterprise', status:'online', avatar:'SA', jobTitle:'Platform Administrator', company:'Executive Flow', loginCount:42, lastLogin:new Date() });
  const alex  = await User.create({ name:'Alex Johnson', email:'alex@acme.com',          password:await bcrypt.hash('user123',10),  role:'customer', plan:'Pro',        status:'online', avatar:'AJ', jobTitle:'Product Manager',        company:'Acme Corp',    loginCount:18, lastLogin:new Date() });
  const maria = await User.create({ name:'Maria Chen',   email:'maria@acme.com',         password:await bcrypt.hash('user123',10),  role:'customer', plan:'Pro',        status:'online', avatar:'MC', jobTitle:'Lead Engineer',          company:'Acme Corp',    loginCount:9,  lastLogin:new Date() });
  const james = await User.create({ name:'James Wilson', email:'james@acme.com',         password:await bcrypt.hash('user123',10),  role:'customer', plan:'Starter',    status:'offline',avatar:'JW', jobTitle:'Designer',               company:'Acme Corp',    loginCount:5 });
  const lisa  = await User.create({ name:'Lisa Park',    email:'lisa@acme.com',          password:await bcrypt.hash('user123',10),  role:'customer', plan:'Pro',        status:'busy',   avatar:'LP', jobTitle:'Marketing Lead',         company:'Acme Corp',    loginCount:7,  lastLogin:new Date() });
  console.log('Users seeded: 5');

  await Task.insertMany([
    { title:'Write Q1 product spec',     priority:'high',   status:'backlog',    tags:['Product'],  assignees:['AJ','MC'], creatorId:alex._id },
    { title:'Set up CI/CD pipeline',     priority:'medium', status:'backlog',    tags:['Eng'],      assignees:['JW'],      creatorId:maria._id },
    { title:'User research interviews',  priority:'low',    status:'backlog',    tags:['Research'], assignees:['LP'],      creatorId:alex._id },
    { title:'Redesign onboarding flow',  priority:'high',   status:'inprogress', tags:['Design'],   assignees:['AJ','LP'], creatorId:alex._id },
    { title:'Integrate Stripe payments', priority:'high',   status:'inprogress', tags:['Eng'],      assignees:['MC'],      creatorId:maria._id },
    { title:'Dashboard analytics v2',    priority:'medium', status:'review',     tags:['Data'],     assignees:['JW'],      creatorId:alex._id },
    { title:'Mobile responsive fixes',   priority:'low',    status:'review',     tags:['Frontend'], assignees:['JW','AJ'], creatorId:james._id },
    { title:'Launch beta program',       priority:'high',   status:'done',       tags:['Growth'],   assignees:['AJ'],      creatorId:alex._id },
    { title:'Security audit',            priority:'high',   status:'done',       tags:['Infra'],    assignees:['SA'],      creatorId:admin._id },
    { title:'API documentation',         priority:'medium', status:'done',       tags:['Docs'],     assignees:['JW'],      creatorId:maria._id },
  ]);
  console.log('Tasks seeded: 10');

  await Goal.insertMany([
    { userId:alex._id, name:'Complete product roadmap',   progress:85,  dueDate:'2024-12-15', color:'#0d9488' },
    { userId:alex._id, name:'4h daily deep work streak',  progress:72,  dueDate:'2024-12-20', color:'#3b82f6' },
    { userId:alex._id, name:'Clear backlog by 50%',       progress:45,  dueDate:'2024-12-31', color:'#f59e0b' },
    { userId:alex._id, name:'Launch customer interviews', progress:100, dueDate:'2024-12-01', color:'#22c55e', isComplete:true },
    { userId:alex._id, name:'Team OKR review',            progress:60,  dueDate:'2024-12-18', color:'#8b5cf6' },
  ]);
  console.log('Goals seeded: 5');

  await Integration.insertMany([
    { name:'Slack',           icon:'💬', description:'Auto-post task updates',             category:'Communication', isConnected:true },
    { name:'Google Calendar', icon:'📅', description:'Sync tasks with calendar events',    category:'Calendar',      isConnected:false },
    { name:'GitHub',          icon:'🐙', description:'Link commits and PRs to tasks',      category:'Development',   isConnected:true },
    { name:'Jira',            icon:'🔷', description:'Bi-directional Jira sync',           category:'Project Mgmt',  isConnected:false },
    { name:'Notion',          icon:'📝', description:'Export reports and documentation',   category:'Documentation', isConnected:false },
    { name:'Figma',           icon:'🎨', description:'Attach design files to tasks',       category:'Design',        isConnected:false },
  ]);
  console.log('Integrations seeded: 6');

  await ApiKey.insertMany([
    { userId:admin._id, name:'Production API',    keyValue:'ef_live_sk_prod_4a2f9c1b7e3d', environment:'production', lastUsed:new Date() },
    { userId:admin._id, name:'Staging API',       keyValue:'ef_test_sk_stag_9c1b4a2f3d7e', environment:'staging',    lastUsed:new Date() },
    { userId:admin._id, name:'Analytics Service', keyValue:'ef_live_sk_anal_7d8e3f2a1c9b', environment:'production', lastUsed:new Date() },
  ]);
  console.log('API Keys seeded: 3');

  await AuditLog.insertMany([
    { userId:admin._id, userName:'Sarah Admin',  event:'User Login',                    ipAddress:'10.0.0.1',      status:'success' },
    { userId:alex._id,  userName:'Alex Johnson', event:'User Login',                    ipAddress:'192.168.1.105', status:'success' },
    { userId:admin._id, userName:'Sarah Admin',  event:'API Key Generated',             ipAddress:'10.0.0.1',      status:'success' },
    { userId:maria._id, userName:'Maria Chen',   event:'Integration Connected (Slack)', ipAddress:'192.168.1.88',  status:'success' },
    {                   userName:'Unknown',       event:'Failed Login Attempt',          ipAddress:'45.23.111.201', status:'error'   },
    { userId:james._id, userName:'James Wilson', event:'Task Created',                  ipAddress:'192.168.1.77',  status:'success' },
    { userId:admin._id, userName:'Sarah Admin',  event:'User Invited (lisa@acme.com)',  ipAddress:'10.0.0.1',      status:'success' },
  ]);
  console.log('Audit Logs seeded: 7');

  await Notification.insertMany([
    { userId:alex._id,  icon:'💬', title:'Maria mentioned you',        subtitle:'Dashboard analytics · "Can you review?"', isRead:false },
    { userId:alex._id,  icon:'✅', title:'Sprint review completed',     subtitle:'12 tasks moved to Done',                 isRead:false },
    { userId:alex._id,  icon:'🎉', title:'Goal achieved: Launch beta!', subtitle:'Congrats on hitting 100%',               isRead:true  },
    { userId:alex._id,  icon:'💳', title:'Invoice paid — $79.00',       subtitle:'Pro Plan · December 2024',               isRead:true  },
    { userId:admin._id, icon:'⚠️', title:'System alert: High CPU',      subtitle:'CPU at 88% — resolved in 4min',         isRead:false },
    { userId:admin._id, icon:'👤', title:'New user registered',         subtitle:'Lisa Park joined',                       isRead:true  },
  ]);
  console.log('Notifications seeded: 6');

  console.log('\nSeed complete!');
  console.log('Admin: admin@executiveflow.io / admin123');
  console.log('User:  alex@acme.com / user123');
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e.message); process.exit(1); });
