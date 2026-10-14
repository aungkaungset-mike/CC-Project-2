// Hybrid API Client & LocalStorage Database Engine
// Seamlessly operates in dual mode:
// 1. Full-Stack Mode: Connects to Node.js / Express REST API (Local, Render, VM)
// 2. Static / GitHub Pages Mode: Instant offline LocalStorage persistence with full CRUD

const LocalDB = {
  KEY: 'cloudtask_db_v1',

  getInitialSeed() {
    const now = new Date();
    const formatOffsetDate = (days) => {
      const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return d.toISOString().split('T')[0];
    };

    return {
      members: [
        { id: 'mem-1', name: 'Alex Rivera', role: 'Team Lead & Cloud Architect', email: 'alex.rivera@university.edu', avatarColor: '#6366f1', initials: 'AR' },
        { id: 'mem-2', name: 'Priya Sharma', role: 'Full Stack Developer', email: 'priya.s@university.edu', avatarColor: '#ec4899', initials: 'PS' },
        { id: 'mem-3', name: 'Jordan Chen', role: 'Backend & DevOps Engineer', email: 'jordan.chen@university.edu', avatarColor: '#06b6d4', initials: 'JC' },
        { id: 'mem-4', name: 'Maya Patel', role: 'UI/UX & Frontend Designer', email: 'maya.patel@university.edu', avatarColor: '#10b981', initials: 'MP' },
        { id: 'mem-5', name: 'Carlos Ortiz', role: 'QA & Database Specialist', email: 'carlos.o@university.edu', avatarColor: '#f59e0b', initials: 'CO' }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Cloud-Based Student Management System',
          code: 'CS-401',
          description: 'Distributed web portal for student academic tracking, task delegation, cloud-hosted microservices and live project monitoring.',
          category: 'Cloud Computing',
          startDate: formatOffsetDate(-14),
          deadline: formatOffsetDate(10),
          status: 'active',
          color: '#6366f1',
          members: ['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5']
        },
        {
          id: 'proj-2',
          name: 'Autonomous Campus Robot Navigation',
          code: 'ROB-302',
          description: 'LiDAR and SLAM navigation algorithms embedded on robotic rover with real-time telemetry streaming to cloud backend.',
          category: 'Robotics & AI',
          startDate: formatOffsetDate(-20),
          deadline: formatOffsetDate(25),
          status: 'active',
          color: '#06b6d4',
          members: ['mem-1', 'mem-3', 'mem-5']
        },
        {
          id: 'proj-3',
          name: 'NextGen Smart Library Mobile App',
          code: 'SE-310',
          description: 'Cross-platform mobile application with QR book reservation, NFC study pod checkout, and automated fines notification.',
          category: 'Software Engineering',
          startDate: formatOffsetDate(-30),
          deadline: formatOffsetDate(-2),
          status: 'active',
          color: '#ec4899',
          members: ['mem-2', 'mem-4']
        }
      ],
      tasks: [
        {
          id: 'task-101',
          projectId: 'proj-1',
          title: 'Design RESTful API for Cloud Project Management',
          description: 'Define schemas for Projects, Tasks, Assignees and Status Transitions.',
          assigneeId: 'mem-3',
          priority: 'high',
          category: 'Backend',
          status: 'completed',
          deadline: formatOffsetDate(-4)
        },
        {
          id: 'task-102',
          projectId: 'proj-1',
          title: 'Build Interactive Kanban Board & Task Cards',
          description: 'Create responsive drag-and-drop columns with modern glassmorphism aesthetic.',
          assigneeId: 'mem-2',
          priority: 'urgent',
          category: 'Frontend',
          status: 'in_progress',
          deadline: formatOffsetDate(2)
        },
        {
          id: 'task-103',
          projectId: 'proj-1',
          title: 'Deploy to Cloud VM & Configure Nginx Proxy',
          description: 'Write setup scripts for Ubuntu cloud VM instance, configure daemon and health checks.',
          assigneeId: 'mem-1',
          priority: 'urgent',
          category: 'Cloud/DevOps',
          status: 'review',
          deadline: formatOffsetDate(1)
        },
        {
          id: 'task-104',
          projectId: 'proj-1',
          title: 'Implement Deadline Tracker & Overdue Alert Badges',
          description: 'Calculate relative deadlines and display animated alert badges.',
          assigneeId: 'mem-4',
          priority: 'medium',
          category: 'UI/UX',
          status: 'todo',
          deadline: formatOffsetDate(4)
        },
        {
          id: 'task-105',
          projectId: 'proj-1',
          title: 'Automated Database Persistence & Backup Scripts',
          description: 'Implement atomic JSON writing with fallback backup files for evaluations.',
          assigneeId: 'mem-5',
          priority: 'medium',
          category: 'Database',
          status: 'completed',
          deadline: formatOffsetDate(-2)
        },
        {
          id: 'task-106',
          projectId: 'proj-1',
          title: 'Draft Final Semester Project Presentation Slides',
          description: 'Summarize system architecture diagram and live walkthrough.',
          assigneeId: 'mem-1',
          priority: 'high',
          category: 'Documentation',
          status: 'todo',
          deadline: formatOffsetDate(8)
        },
        {
          id: 'task-201',
          projectId: 'proj-2',
          title: 'Calibrate LiDAR Sensor & Point Cloud Filters',
          description: 'Run outdoor perimeter test to measure noise reduction performance.',
          assigneeId: 'mem-3',
          priority: 'high',
          category: 'Hardware',
          status: 'in_progress',
          deadline: formatOffsetDate(5)
        },
        {
          id: 'task-202',
          projectId: 'proj-2',
          title: 'Implement Cloud Telemetry WebSocket Bridge',
          description: 'Stream robot coordinate packets to cloud dashboard.',
          assigneeId: 'mem-1',
          priority: 'urgent',
          category: 'Cloud/DevOps',
          status: 'todo',
          deadline: formatOffsetDate(12)
        },
        {
          id: 'task-301',
          projectId: 'proj-3',
          title: 'Fix Library Barcode Scanning Crash on iOS 18',
          description: 'Camera permission handler threw uncaught exception during cold boot.',
          assigneeId: 'mem-2',
          priority: 'urgent',
          category: 'Mobile Dev',
          status: 'review',
          deadline: formatOffsetDate(-1)
        }
      ],
      activities: [
        { id: 'act-1', memberId: 'mem-1', action: 'CREATED_PROJECT', details: 'Created project "Cloud-Based Student Management System (CS-401)"', timestamp: new Date(Date.now() - 14 * 86400000).toISOString() },
        { id: 'act-2', memberId: 'mem-3', action: 'COMPLETED_TASK', details: 'Completed task "Design RESTful API for Cloud Project Management"', timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
        { id: 'act-3', memberId: 'mem-2', action: 'MOVED_TASK', details: 'Moved "Build Interactive Kanban Board" to In Progress', timestamp: new Date(Date.now() - 1 * 86400000).toISOString() }
      ],
      activeMemberId: 'mem-1'
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const seed = this.getInitialSeed();
    this.save(seed);
    return seed;
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {}
  },

  reset() {
    const seed = this.getInitialSeed();
    this.save(seed);
    return seed;
  }
};

const API = {
  baseUrl: '/api',
  actorId: null,
  isStaticMode: false,

  setActorId(id) {
    this.actorId = id;
  },

  async request(endpoint, options = {}) {
    // If running on GitHub Pages (github.io) or static file protocol, route directly to LocalDB
    if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:' || this.isStaticMode) {
      return this.handleLocalRequest(endpoint, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(this.actorId ? { 'x-actor-id': this.actorId } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      // Backend unavailable; activate Client-Side LocalDB fallback seamlessly
      console.warn(`[CloudTask] Backend unreachable at ${endpoint}, falling back to Client-Side LocalStorage:`, err.message);
      this.isStaticMode = true;
      return this.handleLocalRequest(endpoint, options);
    }
  },

  // Client-Side Database Fallback Handler (For GitHub Pages)
  handleLocalRequest(endpoint, options) {
    const db = LocalDB.load();
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    const cleanPath = endpoint.split('?')[0];

    // Health
    if (cleanPath === '/health') {
      return Promise.resolve({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        system: {
          platform: 'github-pages (Cloud Client)',
          hostname: window.location.hostname,
          uptimeSeconds: 3600,
          memory: { freeMB: 512, totalMB: 1024, usagePercent: 50 },
          cpuCount: navigator.hardwareConcurrency || 4
        },
        app: { name: 'Cloud-Based Student Project Management System', version: '1.0.0', cloudReady: true }
      });
    }

    // Members
    if (cleanPath === '/members') {
      if (method === 'POST') {
        const initials = body.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
        const newMember = {
          id: 'mem-' + Math.random().toString(36).substr(2, 6),
          name: body.name,
          role: body.role || 'Team Member',
          email: body.email || `${body.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
          avatarColor: body.avatarColor || '#6366f1',
          initials
        };
        db.members.push(newMember);
        LocalDB.save(db);
        return Promise.resolve(newMember);
      }
      return Promise.resolve({ members: db.members, activeMemberId: db.activeMemberId });
    }

    if (cleanPath === '/members/active') {
      if (method === 'POST') {
        db.activeMemberId = body.memberId;
        LocalDB.save(db);
        const m = db.members.find(x => x.id === body.memberId);
        return Promise.resolve({ success: true, activeMember: m });
      }
      const active = db.members.find(x => x.id === db.activeMemberId) || db.members[0];
      return Promise.resolve(active);
    }

    // Projects
    if (cleanPath === '/projects') {
      if (method === 'POST') {
        const newProject = {
          id: 'proj-' + Math.random().toString(36).substr(2, 6),
          name: body.name,
          code: body.code || 'PRJ-101',
          category: body.category || 'General',
          description: body.description || '',
          startDate: body.startDate || new Date().toISOString().split('T')[0],
          deadline: body.deadline,
          status: 'active',
          color: body.color || '#6366f1',
          members: body.members || [db.activeMemberId]
        };
        db.projects.push(newProject);
        db.activities.unshift({
          id: 'act-' + Date.now(),
          memberId: db.activeMemberId,
          action: 'CREATED_PROJECT',
          details: `Created project "${newProject.name}"`,
          timestamp: new Date().toISOString()
        });
        LocalDB.save(db);
        return Promise.resolve(newProject);
      }

      // GET projects with stats
      const projectsWithStats = db.projects.map(p => {
        const pTasks = db.tasks.filter(t => t.projectId === p.id);
        const total = pTasks.length;
        const completed = pTasks.filter(t => t.status === 'completed').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isOverdue = new Date(p.deadline) < new Date() && progress < 100;
        return {
          ...p,
          progress,
          isOverdue,
          taskStats: {
            total,
            completed,
            inProgress: pTasks.filter(t => t.status === 'in_progress').length,
            review: pTasks.filter(t => t.status === 'review').length,
            todo: pTasks.filter(t => t.status === 'todo').length
          }
        };
      });
      return Promise.resolve(projectsWithStats);
    }

    if (cleanPath.startsWith('/projects/')) {
      const pId = cleanPath.split('/')[2];
      if (method === 'DELETE') {
        db.projects = db.projects.filter(p => p.id !== pId);
        db.tasks = db.tasks.filter(t => t.projectId !== pId);
        LocalDB.save(db);
        return Promise.resolve({ success: true });
      }
      if (method === 'PUT') {
        const idx = db.projects.findIndex(p => p.id === pId);
        if (idx !== -1) {
          db.projects[idx] = { ...db.projects[idx], ...body };
          LocalDB.save(db);
          return Promise.resolve(db.projects[idx]);
        }
      }
    }

    // Tasks
    if (cleanPath === '/tasks') {
      if (method === 'POST') {
        const newTask = {
          id: 'task-' + Math.random().toString(36).substr(2, 6),
          title: body.title,
          description: body.description || '',
          projectId: body.projectId || db.projects[0]?.id,
          assigneeId: body.assigneeId || db.activeMemberId,
          priority: body.priority || 'medium',
          category: body.category || 'General',
          deadline: body.deadline || new Date().toISOString().split('T')[0],
          status: body.status || 'todo'
        };
        db.tasks.push(newTask);
        db.activities.unshift({
          id: 'act-' + Date.now(),
          memberId: db.activeMemberId,
          action: 'CREATED_TASK',
          details: `Created task "${newTask.title}"`,
          timestamp: new Date().toISOString()
        });
        LocalDB.save(db);
        return Promise.resolve(this.enrichTask(newTask, db));
      }

      // GET tasks with filter
      const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
      let list = db.tasks.map(t => this.enrichTask(t, db));

      const fProj = urlParams.get('projectId');
      const fAssignee = urlParams.get('assigneeId');
      const fStatus = urlParams.get('status');
      const fPriority = urlParams.get('priority');
      const fSearch = urlParams.get('search');

      if (fProj && fProj !== 'all') list = list.filter(t => t.projectId === fProj);
      if (fAssignee) list = list.filter(t => t.assigneeId === fAssignee);
      if (fStatus) list = list.filter(t => t.status === fStatus);
      if (fPriority) list = list.filter(t => t.priority === fPriority);
      if (fSearch) {
        const q = fSearch.toLowerCase();
        list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
      }

      return Promise.resolve(list);
    }

    if (cleanPath.startsWith('/tasks/')) {
      const tId = cleanPath.split('/')[2];
      if (method === 'DELETE') {
        db.tasks = db.tasks.filter(t => t.id !== tId);
        LocalDB.save(db);
        return Promise.resolve({ success: true });
      }
      if (method === 'PUT') {
        const idx = db.tasks.findIndex(t => t.id === tId);
        if (idx !== -1) {
          const old = db.tasks[idx];
          db.tasks[idx] = { ...old, ...body };

          if (body.status && body.status !== old.status) {
            db.activities.unshift({
              id: 'act-' + Date.now(),
              memberId: db.activeMemberId,
              action: body.status === 'completed' ? 'COMPLETED_TASK' : 'MOVED_TASK',
              details: `Moved "${old.title}" to ${body.status}`,
              timestamp: new Date().toISOString()
            });
          }

          LocalDB.save(db);
          return Promise.resolve(this.enrichTask(db.tasks[idx], db));
        }
      }
    }

    // Activities
    if (cleanPath === '/activities') {
      const enriched = db.activities.slice(0, 30).map(a => {
        const m = db.members.find(x => x.id === a.memberId);
        return {
          ...a,
          memberName: m ? m.name : 'Team Member',
          memberInitials: m ? m.initials : 'TM',
          memberColor: m ? m.avatarColor : '#6366f1'
        };
      });
      return Promise.resolve(enriched);
    }

    // Metrics
    if (cleanPath === '/metrics') {
      const totalTasks = db.tasks.length;
      const completedTasks = db.tasks.filter(t => t.status === 'completed').length;
      return Promise.resolve({
        totalProjects: db.projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks: db.tasks.filter(t => t.status === 'in_progress').length,
        reviewTasks: db.tasks.filter(t => t.status === 'review').length,
        todoTasks: db.tasks.filter(t => t.status === 'todo').length,
        overdueTasks: db.tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'completed').length,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      });
    }

    // Reset Demo Data
    if (cleanPath === '/reset') {
      const fresh = LocalDB.reset();
      return Promise.resolve({ success: true, data: fresh });
    }

    return Promise.resolve({});
  },

  enrichTask(task, db) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const deadlineDate = new Date(task.deadline + 'T23:59:59');
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    let deadlineStatus = 'upcoming';
    if (task.status === 'completed') deadlineStatus = 'done';
    else if (diffDays < 0) deadlineStatus = 'overdue';
    else if (diffDays === 0 || task.deadline === todayStr) deadlineStatus = 'today';
    else if (diffDays <= 3) deadlineStatus = 'soon';

    const assignee = db.members.find(m => m.id === task.assigneeId);
    const project = db.projects.find(p => p.id === task.projectId);

    return {
      ...task,
      deadlineStatus,
      diffDays,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      assigneeInitials: assignee ? assignee.initials : '?',
      assigneeColor: assignee ? assignee.avatarColor : '#9ca3af',
      projectName: project ? project.name : 'Coursework',
      projectColor: project ? project.color : '#6366f1'
    };
  },

  // Health & Cloud Telemetry
  getHealth() {
    return this.request('/health');
  },

  // Members
  getMembers() {
    return this.request('/members');
  },
  getActiveMember() {
    return this.request('/members/active');
  },
  setActiveMember(memberId) {
    return this.request('/members/active', {
      method: 'POST',
      body: JSON.stringify({ memberId })
    });
  },
  createMember(data) {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Projects
  getProjects() {
    return this.request('/projects');
  },
  getProject(id) {
    return this.request(`/projects/${id}`);
  },
  createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Tasks
  getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  },
  getTask(id) {
    return this.request(`/tasks/${id}`);
  },
  createTask(data) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateTask(id, data) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  // Activities & Metrics
  getActivities(limit = 30) {
    return this.request(`/activities?limit=${limit}`);
  },
  getMetrics() {
    return this.request('/metrics');
  },

  // Reset Demo Data
  resetDemoData() {
    return this.request('/reset', {
      method: 'POST'
    });
  }
};
