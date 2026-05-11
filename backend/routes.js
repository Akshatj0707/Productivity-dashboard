const express = require('express');
const bcrypt  = require('bcryptjs');
const { getModels } = require('./models/index');
const { genToken, auth, adminOnly, audit } = require('./auth');
const router = express.Router();

// ── Health ──────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbMode = mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'In-Memory Mock DB';
  res.json({ status:'ok', database:dbMode, version:'2.0.0', timestamp:new Date().toISOString(), uptime:Math.floor(process.uptime())+'s' });
});

// ══ AUTH ════════════════════════════════════════════════════════
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error:'Email and password required' });
    const M = getModels();
    const user = await M.User.findOne({ email: email.toLowerCase().trim() });
    if (!user) { await audit(M, null,'Unknown','Failed Login',req.ip,'error'); return res.status(401).json({ error:'Invalid email or password' }); }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  { await audit(M, user._id, user.name,'Failed Login',req.ip,'error'); return res.status(401).json({ error:'Invalid email or password' }); }
    await M.User.findByIdAndUpdate(user._id, { $set:{ status:'online', lastLogin:new Date(), loginCount:(user.loginCount||0)+1 } });
    await audit(M, user._id, user.name, 'User Login', req.ip);
    const safe = { ...user }; if(safe.toObject) Object.assign(safe, user.toObject()); delete safe.password;
    res.json({ token: genToken(user), user: safe });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, company, jobTitle } = req.body;
    if (!name||!email||!password) return res.status(400).json({ error:'Name, email and password required' });
    if (password.length < 6) return res.status(400).json({ error:'Password must be at least 6 characters' });
    const M = getModels();
    const exists = await M.User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error:'Email already registered' });
    const avatar = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
    const hash = await bcrypt.hash(password, 10);
    const user = await M.User.create({ name:name.trim(), email:email.toLowerCase().trim(), password:hash, avatar, jobTitle:jobTitle||'', company:company||'', role:'customer', plan:'Free', status:'online' });
    await audit(M, user._id, user.name, 'User Registered', req.ip);
    const safe = { ...user }; if(safe.toObject) Object.assign(safe, user.toObject()); delete safe.password;
    res.status(201).json({ token: genToken(user), user: safe });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/auth/logout', auth, async (req, res) => {
  try {
    const M = getModels();
    await M.User.findByIdAndUpdate(req.user._id, { $set:{ status:'offline' } });
    await audit(M, req.user._id, req.user.name, 'User Logout', req.ip);
    res.json({ message:'Logged out' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.get('/auth/me', auth, async (req, res) => {
  try {
    const M = getModels();
    const user = await M.User.findById(req.user._id);
    const safe = { ...user }; if(safe.toObject) Object.assign(safe, user.toObject()); delete safe.password;
    res.json(safe);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/auth/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const M = getModels();
    const user = await M.User.findById(req.user._id);
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ error:'Current password is incorrect' });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error:'New password too short' });
    await M.User.findByIdAndUpdate(req.user._id, { $set:{ password: await bcrypt.hash(newPassword, 10) } });
    res.json({ message:'Password updated' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ USERS ═══════════════════════════════════════════════════════
router.get('/users/me', auth, async (req, res) => {
  try {
    const M = getModels(); const user = await M.User.findById(req.user._id);
    const safe = { ...user }; if(safe.toObject) Object.assign(safe, user.toObject()); delete safe.password;
    res.json(safe);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/users/me', auth, async (req, res) => {
  try {
    const { name, jobTitle, company, timezone } = req.body;
    const M = getModels();
    const fields = {};
    if (name)     { fields.name = name; fields.avatar = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase(); }
    if (jobTitle !== undefined) fields.jobTitle = jobTitle;
    if (company  !== undefined) fields.company  = company;
    if (timezone)  fields.timezone = timezone;
    const updated = await M.User.findByIdAndUpdate(req.user._id, { $set: fields }, { new:true });
    const safe = { ...updated }; if(safe.toObject) Object.assign(safe, updated.toObject()); delete safe.password;
    res.json(safe);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: list all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const M = getModels();
    const users = await M.User.find({ isActive:true });
    const list = Array.isArray(users) ? users : [];
    res.json(list.map(u => { const s={...u}; if(s.toObject)Object.assign(s,u.toObject()); delete s.password; return s; }));
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: invite user
router.post('/users', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, plan, jobTitle, company } = req.body;
    if (!name||!email) return res.status(400).json({ error:'Name and email required' });
    const M = getModels();
    const exists = await M.User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error:'Email already exists' });
    const avatar = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
    const hash = await bcrypt.hash(password||'Welcome123!', 10);
    const user = await M.User.create({ name, email:email.toLowerCase(), password:hash, role:role||'customer', plan:plan||'Free', avatar, jobTitle:jobTitle||'', company:company||'' });
    await audit(M, req.user._id, req.user.name, `User Invited (${email})`, req.ip);
    const safe = { ...user }; if(safe.toObject) Object.assign(safe, user.toObject()); delete safe.password;
    res.status(201).json(safe);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: update user
router.put('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, role, plan, isActive } = req.body;
    const M = getModels(); const fields = {};
    if (name)  { fields.name=name; fields.avatar=name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase(); }
    if (email)   fields.email=email;
    if (role)    fields.role=role;
    if (plan)    fields.plan=plan;
    if (isActive !== undefined) fields.isActive = isActive;
    const updated = await M.User.findByIdAndUpdate(req.params.id, { $set:fields }, { new:true });
    await audit(M, req.user._id, req.user.name, 'User Updated', req.ip);
    const safe = { ...updated }; if(safe.toObject) Object.assign(safe, updated.toObject()); delete safe.password;
    res.json(safe);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: deactivate user
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ error:'Cannot delete yourself' });
    const M = getModels();
    await M.User.findByIdAndUpdate(req.params.id, { $set:{ isActive:false, status:'offline' } });
    await audit(M, req.user._id, req.user.name, 'User Deactivated', req.ip);
    res.json({ message:'User deactivated' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ TASKS ════════════════════════════════════════════════════════
router.get('/tasks', auth, async (req, res) => {
  try {
    const M = getModels();
    const q = req.query.status ? { status: req.query.status } : {};
    const tasks = await M.Task.find(q);
    res.json(Array.isArray(tasks) ? tasks : []);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.post('/tasks', auth, async (req, res) => {
  try {
    const { title, description, priority, status, tags, assignees, dueDate } = req.body;
    if (!title) return res.status(400).json({ error:'Title required' });
    const M = getModels();
    const task = await M.Task.create({ title, description:description||'', priority:priority||'medium', status:status||'backlog', tags:tags||[], assignees:assignees||[], creatorId:req.user._id, dueDate:dueDate||null });
    await audit(M, req.user._id, req.user.name, `Task Created: ${title}`, req.ip);
    res.status(201).json(task);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/tasks/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, status, tags, assignees, dueDate } = req.body;
    const M = getModels(); const fields = {};
    if (title       !== undefined) fields.title       = title;
    if (description !== undefined) fields.description = description;
    if (priority    !== undefined) fields.priority    = priority;
    if (status      !== undefined) fields.status      = status;
    if (tags        !== undefined) fields.tags        = tags;
    if (assignees   !== undefined) fields.assignees   = assignees;
    if (dueDate     !== undefined) fields.dueDate     = dueDate;
    const task = await M.Task.findByIdAndUpdate(req.params.id, { $set:fields }, { new:true });
    res.json(task);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const M = getModels();
    await M.Task.findByIdAndDelete(req.params.id);
    await audit(M, req.user._id, req.user.name, 'Task Deleted', req.ip);
    res.json({ message:'Task deleted' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ GOALS ════════════════════════════════════════════════════════
router.get('/goals', auth, async (req, res) => {
  try {
    const M = getModels();
    const goals = await M.Goal.find({ userId: req.user._id.toString() });
    res.json(Array.isArray(goals) ? goals : []);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.post('/goals', auth, async (req, res) => {
  try {
    const { name, description, progress, target, dueDate, color } = req.body;
    if (!name) return res.status(400).json({ error:'Goal name required' });
    const M = getModels();
    const goal = await M.Goal.create({ userId:req.user._id, name, description:description||'', progress:progress||0, target:target||100, dueDate:dueDate||null, color:color||'#0d9488', isComplete:(progress||0)>=100 });
    res.status(201).json(goal);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/goals/:id', auth, async (req, res) => {
  try {
    const { name, description, progress, target, dueDate, color } = req.body;
    const M = getModels(); const fields = {};
    if (name        !== undefined) fields.name        = name;
    if (description !== undefined) fields.description = description;
    if (progress    !== undefined) { fields.progress = progress; fields.isComplete = progress >= (target||100); }
    if (target      !== undefined) fields.target      = target;
    if (dueDate     !== undefined) fields.dueDate     = dueDate;
    if (color       !== undefined) fields.color       = color;
    const goal = await M.Goal.findByIdAndUpdate(req.params.id, { $set:fields }, { new:true });
    res.json(goal);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const M = getModels();
    await M.Goal.findByIdAndDelete(req.params.id);
    res.json({ message:'Goal deleted' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ INTEGRATIONS ═════════════════════════════════════════════════
router.get('/integrations', auth, async (req, res) => {
  try { const M=getModels(); const list=await M.Integration.find({}); res.json(Array.isArray(list)?list:[]); }
  catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/integrations/:id/toggle', auth, async (req, res) => {
  try {
    const M = getModels();
    const intg = await M.Integration.findById(req.params.id);
    if (!intg) return res.status(404).json({ error:'Integration not found' });
    const newState = !intg.isConnected;
    const updated = await M.Integration.findByIdAndUpdate(req.params.id, { $set:{ isConnected:newState, connectedBy:newState?req.user._id:null, connectedAt:newState?new Date():null } }, { new:true });
    await audit(M, req.user._id, req.user.name, `Integration ${newState?'Connected':'Disconnected'} (${intg.name})`, req.ip);
    res.json(updated||{ ...intg, isConnected:newState });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ API KEYS ══════════════════════════════════════════════════════
router.get('/keys', auth, adminOnly, async (req, res) => {
  try {
    const M = getModels();
    const keys = await M.ApiKey.find({ isActive:true });
    const list = Array.isArray(keys) ? keys : [];
    res.json(list.map(k => ({ ...k, keyDisplay: k.keyDisplay || (k.keyValue.slice(0,14)+'••••••••'+k.keyValue.slice(-4)) })));
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.post('/keys', auth, adminOnly, async (req, res) => {
  try {
    const { name, environment } = req.body;
    if (!name) return res.status(400).json({ error:'Key name required' });
    const M = getModels();
    const prefix = environment==='staging' ? 'ef_test_sk' : 'ef_live_sk';
    const rand = Math.random().toString(36).slice(2,14)+Math.random().toString(36).slice(2,14);
    const keyValue = `${prefix}_${rand}`;
    const key = await M.ApiKey.create({ userId:req.user._id, name, keyValue, environment:environment||'production' });
    await audit(M, req.user._id, req.user.name, `API Key Generated: ${name}`, req.ip);
    res.status(201).json({ ...key, keyDisplay: keyValue.slice(0,14)+'••••••••'+keyValue.slice(-4) });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.delete('/keys/:id', auth, adminOnly, async (req, res) => {
  try {
    const M = getModels();
    await M.ApiKey.findByIdAndUpdate(req.params.id, { $set:{ isActive:false } });
    await audit(M, req.user._id, req.user.name, 'API Key Revoked', req.ip);
    res.json({ message:'Key revoked' });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ AUDIT LOGS ════════════════════════════════════════════════════
router.get('/audit', auth, adminOnly, async (req, res) => {
  try {
    const M = getModels();
    const { limit=50, offset=0, status, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) q.$or = [{ event:{ $regex:search,$options:'i' } }, { userName:{ $regex:search,$options:'i' } }];
    const logs = await M.AuditLog.find(q);
    const arr = Array.isArray(logs) ? logs : [];
    arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ logs: arr.slice(Number(offset), Number(offset)+Number(limit)), total: arr.length });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ NOTIFICATIONS ═════════════════════════════════════════════════
router.get('/notifications', auth, async (req, res) => {
  try {
    const M = getModels();
    const notifs = await M.Notification.find({ userId: req.user._id.toString() });
    const arr = Array.isArray(notifs) ? notifs : [];
    arr.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    res.json(arr.slice(0,20));
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/notifications/:id/read', auth, async (req, res) => {
  try { const M=getModels(); await M.Notification.findByIdAndUpdate(req.params.id, { $set:{ isRead:true } }); res.json({ message:'Read' }); }
  catch(e) { res.status(500).json({ error:e.message }); }
});

router.put('/notifications/read-all', auth, async (req, res) => {
  try { const M=getModels(); await M.Notification.updateMany({ userId:req.user._id.toString(), isRead:false }, { $set:{ isRead:true } }); res.json({ message:'All read' }); }
  catch(e) { res.status(500).json({ error:e.message }); }
});

// ══ ANALYTICS ════════════════════════════════════════════════════
router.get('/analytics/dashboard', auth, async (req, res) => {
  try {
    const M = getModels();
    const tasks = await M.Task.find({});
    const goals = await M.Goal.find({ userId: req.user._id.toString() });
    const tArr  = Array.isArray(tasks) ? tasks : [];
    const gArr  = Array.isArray(goals) ? goals : [];
    const avg = gArr.length ? Math.round(gArr.reduce((s,g)=>s+g.progress,0)/gArr.length) : 0;
    res.json({
      tasksDueToday: 4,
      activeProjects: Math.max(tArr.filter(t=>t.status!=='done').length, 7),
      deepWorkHours: 3.5,
      weeklyGoalProgress: avg,
      tasksDone: tArr.filter(t=>t.status==='done').length,
      weeklyData: { labels:['Mon','Tue','Wed','Thu','Fri'], deepWork:[4,3,4.5,2.5,0], meetings:[2,2,2.5,1,0] },
      timeAllocation: [
        { label:'Deep Work', value:45, color:'#0d9488' },
        { label:'Meetings',  value:25, color:'#3b82f6' },
        { label:'Admin',     value:20, color:'#f59e0b' },
        { label:'Breaks',    value:10, color:'#4a5c56' }
      ]
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.get('/analytics/admin', auth, adminOnly, async (req, res) => {
  try {
    const M = getModels();
    const users = await M.User.find({ isActive:true });
    const tasks = await M.Task.find({});
    const uArr  = Array.isArray(users) ? users : [];
    const tArr  = Array.isArray(tasks) ? tasks : [];
    res.json({
      totalUsers: uArr.length,
      activeToday: uArr.filter(u=>u.status==='online').length,
      totalTasks: tArr.length,
      newUsersThisWeek: 4,
      requestsToday: Math.floor(Math.random()*2000+4000),
      mrr: 19403, arr: 232836, churnRate: 1.8
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

router.get('/analytics/revenue', auth, adminOnly, async (req, res) => {
  res.json({
    mrr:19403, arr:232836, churnRate:1.8, avgLTV:1422,
    mrrHistory: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[8200,9100,9800,10500,12000,13200,14100,15500,16800,17900,18700,19403] },
    planRevenue: [{ plan:'Pro',pct:61 },{ plan:'Enterprise',pct:29 },{ plan:'Starter',pct:10 }],
    topAccounts: [
      { company:'Globex Corp',  plan:'Enterprise', seats:48, mrr:9504, since:'Mar 2023', health:'Healthy' },
      { company:'Acme Inc',     plan:'Pro',        seats:25, mrr:1975, since:'Jun 2023', health:'Healthy' },
      { company:'Initech LLC',  plan:'Enterprise', seats:22, mrr:4378, since:'Jan 2024', health:'At Risk' },
      { company:'Umbrella Co',  plan:'Pro',        seats:18, mrr:1422, since:'Aug 2024', health:'Healthy' },
      { company:'Hooli Inc',    plan:'Starter',    seats:4,  mrr:116,  since:'Nov 2024', health:'New'     },
    ]
  });
});

module.exports = router;
