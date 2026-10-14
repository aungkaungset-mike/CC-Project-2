const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default Seed Data for Student University Project
const getInitialData = () => {
  const members = [
    {
      id: 'mem-1',
      name: 'Alex Rivera',
      role: 'Team Lead & Cloud Architect',
      email: 'alex.rivera@university.edu',
      avatarColor: '#6366f1', // Indigo
      initials: 'AR'
    },
    {
      id: 'mem-2',
      name: 'Priya Sharma',
      role: 'Full Stack Developer',
      email: 'priya.s@university.edu',
      avatarColor: '#ec4899', // Pink
      initials: 'PS'
    },
    {
      id: 'mem-3',
      name: 'Jordan Chen',
      role: 'Backend & DevOps Engineer',
      email: 'jordan.chen@university.edu',
      avatarColor: '#06b6d4', // Cyan
      initials: 'JC'
    },
    {
      id: 'mem-4',
      name: 'Maya Patel',
      role: 'UI/UX & Frontend Designer',
      email: 'maya.patel@university.edu',
      avatarColor: '#10b981', // Emerald
      initials: 'MP'
    },
    {
      id: 'mem-5',
      name: 'Carlos Ortiz',
      role: 'QA & Database Specialist',
      email: 'carlos.o@university.edu',
      avatarColor: '#f59e0b', // Amber
      initials: 'CO'
    }
  ];

  const now = new Date();
  const formatOffsetDate = (days) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const projects = [
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
      members: ['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5'],
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
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
      members: ['mem-1', 'mem-3', 'mem-5'],
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'proj-3',
      name: 'NextGen Smart Library Mobile App',
      code: 'SE-310',
      description: 'Cross-platform mobile application with QR book reservation, NFC study pod checkout, and automated fines notification.',
      category: 'Software Engineering',
      startDate: formatOffsetDate(-30),
      deadline: formatOffsetDate(-2), // overdue project
      status: 'active',
      color: '#ec4899',
      members: ['mem-2', 'mem-4'],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];

  const tasks = [
    // Project 1 Tasks
    {
      id: 'task-101',
      projectId: 'proj-1',
      title: 'Design RESTful API for Cloud Project Management',
      description: 'Define schemas for Projects, Tasks, Assignees and Status Transitions. Implement validation middleware.',
      assigneeId: 'mem-3', // Jordan Chen
      priority: 'high', // low, medium, high, urgent
      category: 'Backend',
      status: 'completed', // todo, in_progress, review, completed
      deadline: formatOffsetDate(-4),
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'task-102',
      projectId: 'proj-1',
      title: 'Build Interactive Kanban Board & Task Cards',
      description: 'Create responsive drag-and-drop columns (To Do, In Progress, Review, Completed) with modern glassmorphism aesthetic.',
      assigneeId: 'mem-2', // Priya Sharma
      priority: 'urgent',
      category: 'Frontend',
      status: 'in_progress',
      deadline: formatOffsetDate(2),
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'task-103',
      projectId: 'proj-1',
      title: 'Deploy to Cloud VM & Configure Nginx Proxy',
      description: 'Write setup scripts for Ubuntu cloud VM instance, configure systemd daemon, SSL reverse proxy, and health checks.',
      assigneeId: 'mem-1', // Alex Rivera
      priority: 'urgent',
      category: 'Cloud/DevOps',
      status: 'review',
      deadline: formatOffsetDate(1),
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'task-104',
      projectId: 'proj-1',
      title: 'Implement Deadline Tracker & Overdue Alert Badges',
      description: 'Calculate relative deadlines (Due Today, Tomorrow, Overdue) and display animated alert badges with filter controls.',
      assigneeId: 'mem-4', // Maya Patel
      priority: 'medium',
      category: 'UI/UX',
      status: 'todo',
      deadline: formatOffsetDate(4),
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'task-105',
      projectId: 'proj-1',
      title: 'Automated Database Persistence & Backup Scripts',
      description: 'Implement atomic JSON writing with fallback backup files and database seed reset utilities for evaluations.',
      assigneeId: 'mem-5', // Carlos Ortiz
      priority: 'medium',
      category: 'Database',
      status: 'completed',
      deadline: formatOffsetDate(-2),
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'task-106',
      projectId: 'proj-1',
      title: 'Draft Final Semester Project Presentation Slides',
      description: 'Summarize system architecture diagram, cloud deployment methodology, team contributions, and demo walkthrough.',
      assigneeId: 'mem-1', // Alex Rivera
      priority: 'high',
      category: 'Documentation',
      status: 'todo',
      deadline: formatOffsetDate(8),
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    // Project 2 Tasks
    {
      id: 'task-201',
      projectId: 'proj-2',
      title: 'Calibrate LiDAR Sensor & Point Cloud Filters',
      description: 'Run outdoor perimeter test to measure noise reduction performance under direct sunlight.',
      assigneeId: 'mem-3',
      priority: 'high',
      category: 'Hardware/Robotics',
      status: 'in_progress',
      deadline: formatOffsetDate(5),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'task-202',
      projectId: 'proj-2',
      title: 'Implement Cloud Telemetry WebSocket Bridge',
      description: 'Stream robot coordinate packets (X, Y, Theta, Battery %) to cloud dashboard over 4G/WiFi module.',
      assigneeId: 'mem-1',
      priority: 'urgent',
      category: 'Cloud/DevOps',
      status: 'todo',
      deadline: formatOffsetDate(12),
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    // Project 3 Tasks
    {
      id: 'task-301',
      projectId: 'proj-3',
      title: 'Fix Library Barcode Scanning Crash on iOS 18',
      description: 'Camera permission handler threw uncaught exception during cold boot barcode scanner invocation.',
      assigneeId: 'mem-2',
      priority: 'urgent',
      category: 'Mobile Dev',
      status: 'review',
      deadline: formatOffsetDate(-1), // overdue task
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  const activities = [
    {
      id: 'act-1',
      memberId: 'mem-1',
      action: 'CREATED_PROJECT',
      details: 'Created project "Cloud-Based Student Management System (CS-401)"',
      projectId: 'proj-1',
      timestamp: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'act-2',
      memberId: 'mem-3',
      action: 'COMPLETED_TASK',
      details: 'Completed task "Design RESTful API for Cloud Project Management"',
      projectId: 'proj-1',
      taskId: 'task-101',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'act-3',
      memberId: 'mem-2',
      action: 'MOVED_TASK',
      details: 'Moved "Build Interactive Kanban Board" to In Progress',
      projectId: 'proj-1',
      taskId: 'task-102',
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'act-4',
      memberId: 'mem-1',
      action: 'MOVED_TASK',
      details: 'Moved "Deploy to Cloud VM & Configure Nginx Proxy" to Review',
      projectId: 'proj-1',
      taskId: 'task-103',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ];

  return {
    members,
    projects,
    tasks,
    activities,
    activeMemberId: 'mem-1' // Default logged-in student
  };
};

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, reinitializing with default seed:', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  reset() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  // --- Activities ---
  logActivity(memberId, action, details, projectId = null, taskId = null) {
    const activity = {
      id: 'act-' + crypto.randomUUID().slice(0, 8),
      memberId,
      action,
      details,
      projectId,
      taskId,
      timestamp: new Date().toISOString()
    };
    this.data.activities.unshift(activity);
    // Keep last 100 activities
    if (this.data.activities.length > 100) {
      this.data.activities = this.data.activities.slice(0, 100);
    }
    this.save();
    return activity;
  }

  getActivities(limit = 30) {
    return this.data.activities.slice(0, limit);
  }

  // --- Members ---
  getMembers() {
    return this.data.members;
  }

  getMemberById(id) {
    return this.data.members.find(m => m.id === id);
  }

  createMember({ name, role, email, avatarColor }) {
    const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
    const member = {
      id: 'mem-' + crypto.randomUUID().slice(0, 8),
      name,
      role: role || 'Team Member',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      avatarColor: avatarColor || '#6366f1',
      initials
    };
    this.data.members.push(member);
    this.save();
    return member;
  }

  getActiveMemberId() {
    return this.data.activeMemberId || this.data.members[0]?.id;
  }

  setActiveMemberId(id) {
    const member = this.getMemberById(id);
    if (!member) return null;
    this.data.activeMemberId = id;
    this.save();
    return member;
  }

  // --- Projects ---
  getProjects() {
    return this.data.projects.map(project => {
      const projectTasks = this.data.tasks.filter(t => t.projectId === project.id);
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const now = new Date();
      const deadlineDate = new Date(project.deadline);
      const isOverdue = deadlineDate < now && progress < 100;

      return {
        ...project,
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: projectTasks.filter(t => t.status === 'in_progress').length,
          review: projectTasks.filter(t => t.status === 'review').length,
          todo: projectTasks.filter(t => t.status === 'todo').length
        },
        progress,
        isOverdue
      };
    });
  }

  getProjectById(id) {
    const project = this.data.projects.find(p => p.id === id);
    if (!project) return null;
    const projectTasks = this.data.tasks.filter(t => t.projectId === project.id);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      taskStats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: projectTasks.filter(t => t.status === 'in_progress').length,
        review: projectTasks.filter(t => t.status === 'review').length,
        todo: projectTasks.filter(t => t.status === 'todo').length
      },
      progress
    };
  }

  createProject({ name, code, description, category, deadline, startDate, color, members }, actorId) {
    const project = {
      id: 'proj-' + crypto.randomUUID().slice(0, 8),
      name,
      code: code || ('CS-' + Math.floor(100 + Math.random() * 900)),
      description: description || '',
      category: category || 'General',
      startDate: startDate || new Date().toISOString().split('T')[0],
      deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'active',
      color: color || '#6366f1',
      members: Array.isArray(members) && members.length > 0 ? members : [actorId || this.getActiveMemberId()],
      createdAt: new Date().toISOString()
    };
    this.data.projects.push(project);
    this.save();

    this.logActivity(actorId || this.getActiveMemberId(), 'CREATED_PROJECT', `Created project "${project.name}" (${project.code})`, project.id);
    return project;
  }

  updateProject(id, updates, actorId) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProject = this.data.projects[index];
    this.data.projects[index] = {
      ...oldProject,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();

    this.logActivity(actorId || this.getActiveMemberId(), 'UPDATED_PROJECT', `Updated project "${oldProject.name}"`, id);
    return this.data.projects[index];
  }

  deleteProject(id, actorId) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    const name = this.data.projects[index].name;
    
    // Delete project
    this.data.projects.splice(index, 1);
    // Delete associated tasks
    this.data.tasks = this.data.tasks.filter(t => t.projectId !== id);
    this.save();

    this.logActivity(actorId || this.getActiveMemberId(), 'DELETED_PROJECT', `Deleted project "${name}" and associated tasks`, id);
    return true;
  }

  // --- Tasks ---
  getTasks(filter = {}) {
    let result = [...this.data.tasks];

    if (filter.projectId && filter.projectId !== 'all') {
      result = result.filter(t => t.projectId === filter.projectId);
    }
    if (filter.assigneeId) {
      result = result.filter(t => t.assigneeId === filter.assigneeId);
    }
    if (filter.status) {
      result = result.filter(t => t.status === filter.status);
    }
    if (filter.priority) {
      result = result.filter(t => t.priority === filter.priority);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Attach computed deadline info
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return result.map(t => {
      const deadlineDate = new Date(t.deadline + 'T23:59:59');
      const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
      
      let deadlineStatus = 'upcoming'; // overdue, today, soon, upcoming
      if (t.status === 'completed') {
        deadlineStatus = 'done';
      } else if (diffDays < 0) {
        deadlineStatus = 'overdue';
      } else if (diffDays === 0 || t.deadline === todayStr) {
        deadlineStatus = 'today';
      } else if (diffDays <= 3) {
        deadlineStatus = 'soon';
      }

      const assignee = this.getMemberById(t.assigneeId);
      const project = this.data.projects.find(p => p.id === t.projectId);

      return {
        ...t,
        deadlineStatus,
        diffDays,
        assigneeName: assignee ? assignee.name : 'Unassigned',
        assigneeInitials: assignee ? assignee.initials : '?',
        assigneeColor: assignee ? assignee.avatarColor : '#9ca3af',
        projectName: project ? project.name : 'Unknown Project',
        projectColor: project ? project.color : '#6366f1'
      };
    });
  }

  getTaskById(id) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return null;
    const assignee = this.getMemberById(task.assigneeId);
    const project = this.data.projects.find(p => p.id === task.projectId);
    return {
      ...task,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      assigneeInitials: assignee ? assignee.initials : '?',
      assigneeColor: assignee ? assignee.avatarColor : '#9ca3af',
      projectName: project ? project.name : 'Unknown Project',
      projectColor: project ? project.color : '#6366f1'
    };
  }

  createTask({ title, description, projectId, assigneeId, priority, category, deadline, status }, actorId) {
    const task = {
      id: 'task-' + crypto.randomUUID().slice(0, 8),
      title: title.trim(),
      description: description || '',
      projectId: projectId || this.data.projects[0]?.id,
      assigneeId: assigneeId || actorId || this.getActiveMemberId(),
      priority: priority || 'medium', // low, medium, high, urgent
      category: category || 'General',
      deadline: deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: status || 'todo', // todo, in_progress, review, completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.tasks.push(task);
    this.save();

    const assignee = this.getMemberById(task.assigneeId);
    const assigneeStr = assignee ? ` and assigned to ${assignee.name}` : '';
    this.logActivity(
      actorId || this.getActiveMemberId(),
      'CREATED_TASK',
      `Created task "${task.title}"${assigneeStr}`,
      task.projectId,
      task.id
    );

    return this.getTaskById(task.id);
  }

  updateTask(id, updates, actorId) {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldTask = this.data.tasks[index];
    const updated = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.tasks[index] = updated;
    this.save();

    // Log specific actions
    const actor = actorId || this.getActiveMemberId();
    if (updates.status && updates.status !== oldTask.status) {
      const statusLabels = {
        todo: 'To Do',
        in_progress: 'In Progress',
        review: 'Review',
        completed: 'Completed'
      };
      const label = statusLabels[updates.status] || updates.status;
      this.logActivity(actor, updates.status === 'completed' ? 'COMPLETED_TASK' : 'MOVED_TASK', 
        `Moved "${oldTask.title}" to ${label}`, updated.projectId, id);
    } else if (updates.assigneeId && updates.assigneeId !== oldTask.assigneeId) {
      const newAssignee = this.getMemberById(updates.assigneeId);
      this.logActivity(actor, 'REASSIGNED_TASK', 
        `Reassigned "${oldTask.title}" to ${newAssignee ? newAssignee.name : 'Unknown'}`, updated.projectId, id);
    } else if (updates.deadline && updates.deadline !== oldTask.deadline) {
      this.logActivity(actor, 'UPDATED_DEADLINE', 
        `Updated deadline for "${oldTask.title}" to ${updates.deadline}`, updated.projectId, id);
    } else {
      this.logActivity(actor, 'UPDATED_TASK', `Updated task details for "${oldTask.title}"`, updated.projectId, id);
    }

    return this.getTaskById(id);
  }

  deleteTask(id, actorId) {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    const task = this.data.tasks[index];
    this.data.tasks.splice(index, 1);
    this.save();

    this.logActivity(actorId || this.getActiveMemberId(), 'DELETED_TASK', `Deleted task "${task.title}"`, task.projectId, id);
    return true;
  }

  // --- Global Analytics & Overview Stats ---
  getDashboardMetrics() {
    const tasks = this.getTasks();
    const projects = this.getProjects();
    const members = this.getMembers();

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const reviewTasks = tasks.filter(t => t.status === 'review').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const overdueTasks = tasks.filter(t => t.deadlineStatus === 'overdue').length;
    const dueSoonTasks = tasks.filter(t => t.deadlineStatus === 'today' || t.deadlineStatus === 'soon').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Member workload
    const memberWorkload = members.map(m => {
      const mTasks = tasks.filter(t => t.assigneeId === m.id);
      const mCompleted = mTasks.filter(t => t.status === 'completed').length;
      return {
        id: m.id,
        name: m.name,
        role: m.role,
        initials: m.initials,
        avatarColor: m.avatarColor,
        totalTasks: mTasks.length,
        completedTasks: mCompleted,
        pendingTasks: mTasks.length - mCompleted
      };
    });

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      overdueTasks,
      dueSoonTasks,
      completionRate,
      memberWorkload,
      projectsSummary: projects.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
        progress: p.progress,
        color: p.color,
        deadline: p.deadline,
        isOverdue: p.isOverdue,
        taskStats: p.taskStats
      }))
    };
  }
}

const db = new Database();
module.exports = db;
