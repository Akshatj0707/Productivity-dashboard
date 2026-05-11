const bcrypt = require('bcryptjs');

const mkid = n => `mock_${n}`;
let counter = 200;
const newId = () => `mock_${++counter}`;

const adminPass = bcrypt.hashSync('admin123', 10);
const userPass  = bcrypt.hashSync('user123',  10);

const USERS = [
  { _id:mkid(1), name:'Sarah Admin',  email:'admin@executiveflow.io', password:adminPass, role:'admin',    plan:'Enterprise', status:'online',  avatar:'SA', jobTitle:'Platform Administrator', company:'Executive Flow', isActive:true, loginCount:42, lastLogin:new Date(), createdAt:new Date('2023-01-01') },
  { _id:mkid(2), name:'Alex Johnson', email:'alex@acme.com',          password:userPass,  role:'customer', plan:'Pro',        status:'online',  avatar:'AJ', jobTitle:'Product Manager',        company:'Acme Corp',    isActive:true, loginCount:18, lastLogin:new Date(), createdAt:new Date('2023-03-15') },
  { _id:mkid(3), name:'Maria Chen',   email:'maria@acme.com',         password:userPass,  role:'customer', plan:'Pro',        status:'online',  avatar:'MC', jobTitle:'Lead Engineer',          company:'Acme Corp',    isActive:true, loginCount:9,  lastLogin:new Date(), createdAt:new Date('2023-04-10') },
  { _id:mkid(4), name:'James Wilson', email:'james@acme.com',         password:userPass,  role:'customer', plan:'Starter',    status:'offline', avatar:'JW', jobTitle:'Designer',               company:'Acme Corp',    isActive:true, loginCount:5,  lastLogin:new Date('2024-11-20'), createdAt:new Date('2023-06-01') },
  { _id:mkid(5), name:'Lisa Park',    email:'lisa@acme.com',          password:userPass,  role:'customer', plan:'Pro',        status:'busy',    avatar:'LP', jobTitle:'Marketing Lead',         company:'Acme Corp',    isActive:true, loginCount:7,  lastLogin:new Date(), createdAt:new Date('2023-08-22') },
];

const TASKS = [
  { _id:mkid(10), title:'Write Q1 product spec',     description:'Define requirements',    priority:'high',   status:'backlog',    tags:['Product'],  assignees:['AJ','MC'], creatorId:mkid(2), createdAt:new Date() },
  { _id:mkid(11), title:'Set up CI/CD pipeline',     description:'Automate deployment',    priority:'medium', status:'backlog',    tags:['Eng'],      assignees:['JW'],      creatorId:mkid(3), createdAt:new Date() },
  { _id:mkid(12), title:'User research interviews',  description:'Conduct 10 interviews',  priority:'low',    status:'backlog',    tags:['Research'], assignees:['LP'],      creatorId:mkid(2), createdAt:new Date() },
  { _id:mkid(13), title:'Redesign onboarding flow',  description:'Improve UX',             priority:'high',   status:'inprogress', tags:['Design'],   assignees:['AJ','LP'], creatorId:mkid(2), createdAt:new Date() },
  { _id:mkid(14), title:'Integrate Stripe payments', description:'Add payment processing', priority:'high',   status:'inprogress', tags:['Eng'],      assignees:['MC'],      creatorId:mkid(3), createdAt:new Date() },
  { _id:mkid(15), title:'Dashboard analytics v2',    description:'Rebuild charts',         priority:'medium', status:'review',     tags:['Data'],     assignees:['JW'],      creatorId:mkid(2), createdAt:new Date() },
  { _id:mkid(16), title:'Mobile responsive fixes',   description:'Fix layout issues',      priority:'low',    status:'review',     tags:['Frontend'], assignees:['JW','AJ'], creatorId:mkid(4), createdAt:new Date() },
  { _id:mkid(17), title:'Launch beta program',       description:'Beta launch activities', priority:'high',   status:'done',       tags:['Growth'],   assignees:['AJ'],      creatorId:mkid(2), createdAt:new Date() },
  { _id:mkid(18), title:'Security audit',            description:'Third-party review',     priority:'high',   status:'done',       tags:['Infra'],    assignees:['SA'],      creatorId:mkid(1), createdAt:new Date() },
  { _id:mkid(19), title:'API documentation',         description:'Write API docs',         priority:'medium', status:'done',       tags:['Docs'],     assignees:['JW'],      creatorId:mkid(3), createdAt:new Date() },
];

const GOALS = [
  { _id:mkid(20), userId:mkid(2), name:'Complete product roadmap',   description:'', progress:85,  target:100, dueDate:new Date('2024-12-15'), color:'#0d9488', isComplete:false, createdAt:new Date() },
  { _id:mkid(21), userId:mkid(2), name:'4h daily deep work streak',  description:'', progress:72,  target:100, dueDate:new Date('2024-12-20'), color:'#3b82f6', isComplete:false, createdAt:new Date() },
  { _id:mkid(22), userId:mkid(2), name:'Clear backlog by 50%',       description:'', progress:45,  target:100, dueDate:new Date('2024-12-31'), color:'#f59e0b', isComplete:false, createdAt:new Date() },
  { _id:mkid(23), userId:mkid(2), name:'Launch customer interviews', description:'', progress:100, target:100, dueDate:new Date('2024-12-01'), color:'#22c55e', isComplete:true,  createdAt:new Date() },
  { _id:mkid(24), userId:mkid(2), name:'Team OKR review',            description:'', progress:60,  target:100, dueDate:new Date('2024-12-18'), color:'#8b5cf6', isComplete:false, createdAt:new Date() },
];

const INTEGRATIONS = [
  { _id:mkid(30), name:'Slack',           icon:'💬', description:'Auto-post task updates and receive notifications',   category:'Communication', isConnected:true,  connectedAt:new Date() },
  { _id:mkid(31), name:'Google Calendar', icon:'📅', description:'Sync tasks with calendar events automatically',      category:'Calendar',      isConnected:false },
  { _id:mkid(32), name:'GitHub',          icon:'🐙', description:'Link commits and PRs directly to tasks',             category:'Development',   isConnected:true,  connectedAt:new Date() },
  { _id:mkid(33), name:'Jira',            icon:'🔷', description:'Bi-directional sync with Jira projects',             category:'Project Mgmt',  isConnected:false },
  { _id:mkid(34), name:'Notion',          icon:'📝', description:'Export reports and documentation seamlessly',        category:'Documentation', isConnected:false },
  { _id:mkid(35), name:'Figma',           icon:'🎨', description:'Attach design files to tasks automatically',         category:'Design',        isConnected:false },
];

const API_KEYS = [
  { _id:mkid(40), userId:mkid(1), name:'Production API',    keyValue:'ef_live_sk_prod_4a2f9c1b7e3d', keyDisplay:'ef_live_sk_prod_••••••••7e3d', environment:'production', isActive:true, lastUsed:new Date(), createdAt:new Date('2024-12-01') },
  { _id:mkid(41), userId:mkid(1), name:'Staging API',       keyValue:'ef_test_sk_stag_9c1b4a2f3d7e', keyDisplay:'ef_test_sk_stag_••••••••3d7e', environment:'staging',    isActive:true, lastUsed:new Date(), createdAt:new Date('2024-11-15') },
  { _id:mkid(42), userId:mkid(1), name:'Analytics Service', keyValue:'ef_live_sk_anal_7d8e3f2a1c9b', keyDisplay:'ef_live_sk_anal_••••••••1c9b', environment:'production', isActive:true, lastUsed:new Date(), createdAt:new Date('2024-10-30') },
];

const AUDIT_LOGS = [
  { _id:mkid(50), userId:mkid(1), userName:'Sarah Admin',  event:'User Login',                    ipAddress:'10.0.0.1',      status:'success', createdAt:new Date() },
  { _id:mkid(51), userId:mkid(2), userName:'Alex Johnson', event:'User Login',                    ipAddress:'192.168.1.105', status:'success', createdAt:new Date() },
  { _id:mkid(52), userId:mkid(1), userName:'Sarah Admin',  event:'API Key Generated',             ipAddress:'10.0.0.1',      status:'success', createdAt:new Date() },
  { _id:mkid(53), userId:mkid(3), userName:'Maria Chen',   event:'Integration Connected (Slack)', ipAddress:'192.168.1.88',  status:'success', createdAt:new Date() },
  { _id:mkid(54), userId:null,    userName:'Unknown',      event:'Failed Login Attempt',          ipAddress:'45.23.111.201', status:'error',   createdAt:new Date() },
  { _id:mkid(55), userId:mkid(4), userName:'James Wilson', event:'Task Created',                  ipAddress:'192.168.1.77',  status:'success', createdAt:new Date() },
  { _id:mkid(56), userId:mkid(1), userName:'Sarah Admin',  event:'User Invited (lisa@acme.com)',  ipAddress:'10.0.0.1',      status:'success', createdAt:new Date() },
];

const NOTIFICATIONS = [
  { _id:mkid(60), userId:mkid(2), icon:'💬', title:'Maria mentioned you in a task',     subtitle:'Dashboard analytics v2', isRead:false, createdAt:new Date() },
  { _id:mkid(61), userId:mkid(2), icon:'✅', title:'Sprint review completed',            subtitle:'12 tasks moved to Done', isRead:false, createdAt:new Date() },
  { _id:mkid(62), userId:mkid(2), icon:'🎉', title:'Goal achieved: Launch beta!',        subtitle:'Congrats on hitting 100%', isRead:true,  createdAt:new Date() },
  { _id:mkid(63), userId:mkid(2), icon:'💳', title:'Invoice paid — $79.00',              subtitle:'Pro Plan · December 2024', isRead:true,  createdAt:new Date() },
  { _id:mkid(64), userId:mkid(1), icon:'⚠️', title:'System alert: High CPU load',        subtitle:'CPU at 88% — resolved', isRead:false, createdAt:new Date() },
  { _id:mkid(65), userId:mkid(1), icon:'👤', title:'New user registered',                subtitle:'Lisa Park joined', isRead:true, createdAt:new Date() },
];

function match(doc, q) {
  for (const [k, v] of Object.entries(q)) {
    if (k === '$or') { if (!v.some(sub => match(doc, sub))) return false; continue; }
    const val = doc[k];
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      if ('$regex' in v && !new RegExp(v.$regex, v.$options||'').test(String(val||''))) return false;
      if ('$in' in v && !v.$in.includes(val)) return false;
      if ('$ne' in v && val === v.$ne) return false;
    } else {
      if (String(val) !== String(v) && val !== v) return false;
    }
  }
  return true;
}

function model(store) {
  return {
    find: (q={}) => { const r=store.filter(d=>match(d,q)); return { sort:()=>({limit:n=>Promise.resolve(r.slice(0,n||9999))}), lean:()=>Promise.resolve(r), then:(res,rej)=>Promise.resolve(r).then(res,rej) }; },
    findOne: (q={}) => { const r=store.find(d=>match(d,q))||null; return { lean:()=>Promise.resolve(r), then:(res,rej)=>Promise.resolve(r).then(res,rej), select:()=>Promise.resolve(r) }; },
    findById: (id) => { const r=store.find(d=>d._id===id)||null; return { lean:()=>Promise.resolve(r), then:(res,rej)=>Promise.resolve(r).then(res,rej) }; },
    countDocuments: (q={}) => Promise.resolve(store.filter(d=>match(d,q)).length),
    create: (data) => {
      const docs = Array.isArray(data)?data:[data];
      const created = docs.map(d=>{ const n={...d,_id:d._id||newId(),createdAt:new Date(),updatedAt:new Date()}; store.push(n); return n; });
      return Promise.resolve(Array.isArray(data)?created:created[0]);
    },
    insertMany: (docs) => { const c=docs.map(d=>{const n={...d,_id:d._id||newId(),createdAt:new Date()};store.push(n);return n;}); return Promise.resolve(c); },
    findByIdAndUpdate: (id,upd,opts={}) => { const i=store.findIndex(d=>d._id===id); if(i===-1)return Promise.resolve(null); Object.assign(store[i],upd.$set||upd,{updatedAt:new Date()}); return Promise.resolve(store[i]); },
    findOneAndUpdate: (q,upd,opts={}) => { const i=store.findIndex(d=>match(d,q)); if(i===-1)return Promise.resolve(null); Object.assign(store[i],upd.$set||upd,{updatedAt:new Date()}); return Promise.resolve(store[i]); },
    updateMany: (q,upd) => { let n=0; store.forEach((d,i)=>{if(match(d,q)){Object.assign(store[i],upd.$set||upd,{updatedAt:new Date()});n++;}}); return Promise.resolve({modifiedCount:n}); },
    findByIdAndDelete: (id) => { const i=store.findIndex(d=>d._id===id); if(i===-1)return Promise.resolve(null); return Promise.resolve(store.splice(i,1)[0]); },
    deleteMany: () => Promise.resolve({deletedCount:0}),
  };
}

const User         = model(USERS);
User._store        = USERS;
const Task         = model(TASKS);
const Goal         = model(GOALS);
const Integration  = model(INTEGRATIONS);
const ApiKey       = model(API_KEYS);
const AuditLog     = model(AUDIT_LOGS);
const Notification = model(NOTIFICATIONS);

module.exports = { User, Task, Goal, Integration, ApiKey, AuditLog, Notification, newId };
