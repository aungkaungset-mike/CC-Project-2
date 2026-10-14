const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const db = require('./data/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get actor ID from request headers or active member
const getActorId = (req) => {
  return req.headers['x-actor-id'] || db.getActiveMemberId();
};

// ================= API ROUTES =================

// 1. Health check & Cloud VM Telemetry
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const freeMemMB = Math.round(os.freemem() / 1024 / 1024);
  const totalMemMB = Math.round(os.totalmem() / 1024 / 1024);

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    system: {
      platform: os.platform(),
      hostname: os.hostname(),
      uptimeSeconds,
      memory: {
        freeMB: freeMemMB,
        totalMB: totalMemMB,
        usagePercent: Math.round(((totalMemMB - freeMemMB) / totalMemMB) * 100)
      },
      cpuCount: os.cpus().length
    },
    app: {
      name: 'Cloud-Based Student Project Management System',
      version: '1.0.0',
      cloudReady: true
    }
  });
});

// 2. Members Management & Active Profile Switcher
app.get('/api/members', (req, res) => {
  try {
    const members = db.getMembers();
    const activeMemberId = db.getActiveMemberId();
    res.json({ members, activeMemberId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const { name, role, email, avatarColor } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Member name is required' });
    }
    const member = db.createMember({ name, role, email, avatarColor });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/members/active', (req, res) => {
  try {
    const activeId = db.getActiveMemberId();
    const member = db.getMemberById(activeId) || db.getMembers()[0];
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members/active', (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required' });
    }
    const member = db.setActiveMemberId(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ success: true, activeMember: member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Projects Management
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.getProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const { name, code, description, category, deadline, startDate, color, members } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const actorId = getActorId(req);
    const project = db.createProject(
      { name, code, description, category, deadline, startDate, color, members },
      actorId
    );
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const actorId = getActorId(req);
    const updated = db.updateProject(req.params.id, req.body, actorId);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const actorId = getActorId(req);
    const success = db.deleteProject(req.params.id, actorId);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project and associated tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Tasks Management & Status Updates
app.get('/api/tasks', (req, res) => {
  try {
    const { projectId, assigneeId, status, priority, search } = req.query;
    const tasks = db.getTasks({ projectId, assigneeId, status, priority, search });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = db.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, projectId, assigneeId, priority, category, deadline, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    const actorId = getActorId(req);
    const task = db.createTask(
      { title, description, projectId, assigneeId, priority, category, deadline, status },
      actorId
    );
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const actorId = getActorId(req);
    const updated = db.updateTask(req.params.id, req.body, actorId);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const actorId = getActorId(req);
    const success = db.deleteTask(req.params.id, actorId);
    if (!success) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Activities & Live Audit Log
app.get('/api/activities', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const rawActivities = db.getActivities(limit);
    const members = db.getMembers();
    const projects = db.getProjects();

    const enriched = rawActivities.map(a => {
      const member = members.find(m => m.id === a.memberId);
      const project = projects.find(p => p.id === a.projectId);
      return {
        ...a,
        memberName: member ? member.name : 'System / Member',
        memberInitials: member ? member.initials : 'SYS',
        memberColor: member ? member.avatarColor : '#6366f1',
        projectName: project ? project.name : null
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Metrics & Analytics
app.get('/api/metrics', (req, res) => {
  try {
    const metrics = db.getDashboardMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Reset to Demo Seed Data (for University Evaluators)
app.post('/api/reset', (req, res) => {
  try {
    const data = db.reset();
    res.json({ success: true, message: 'Database reset to initial university demo data', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Cloud-Based Student Project Management System`);
  console.log(`📡 Server listening on: http://0.0.0.0:${PORT}`);
  console.log(`💻 Local Access: http://localhost:${PORT}`);
  console.log(`☁️ Cloud VM Port: ${PORT}`);
  console.log(`====================================================`);
});
