// API Client for Cloud-Based Student Project Management System

const API = {
  baseUrl: '/api',
  actorId: null,

  setActorId(id) {
    this.actorId = id;
  },

  async request(endpoint, options = {}) {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
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
