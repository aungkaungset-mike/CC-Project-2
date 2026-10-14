// Main Application Orchestrator

const App = {
  projects: [],
  tasks: [],
  members: [],
  activeMember: null,

  currentTab: 'kanban',
  currentProjectId: 'all',
  currentFilterAssignee: 'all', // 'all', 'my_tasks', or memberId
  currentFilterPriority: 'all', // 'all', 'urgent', 'high', 'medium', 'low'
  searchQuery: '',

  async init() {
    console.log('🚀 Initializing Cloud Project Management System...');
    try {
      await this.refreshData();

      // Initialize UI modules
      Kanban.init();
      Team.render();
      Projects.render();
      Analytics.render();

      this.setupEventListeners();
      this.populateProjectFilterSelect();
      this.switchTab('kanban');

      console.log('✅ App initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize app:', err);
      this.showToast('Failed to connect to backend server', 'error');
    }
  },

  async refreshData(skipRender = false) {
    const [projects, tasks, membersData, activeMember] = await Promise.all([
      API.getProjects(),
      API.getTasks(),
      API.getMembers(),
      API.getActiveMember()
    ]);

    this.projects = projects;
    this.tasks = tasks;
    this.members = membersData.members;
    this.activeMember = activeMember;
    API.setActorId(activeMember.id);

    if (!skipRender) {
      this.renderCurrentTab();
      Team.renderNavProfile();
      this.populateProjectFilterSelect();
    }
  },

  getFilteredTasks() {
    let list = [...this.tasks];

    // Filter by Project
    if (this.currentProjectId !== 'all') {
      list = list.filter(t => t.projectId === this.currentProjectId);
    }

    // Filter by Assignee
    if (this.currentFilterAssignee === 'my_tasks') {
      list = list.filter(t => t.assigneeId === this.activeMember?.id);
    } else if (this.currentFilterAssignee !== 'all') {
      list = list.filter(t => t.assigneeId === this.currentFilterAssignee);
    }

    // Filter by Priority
    if (this.currentFilterPriority !== 'all') {
      list = list.filter(t => t.priority === this.currentFilterPriority);
    }

    // Filter by Search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.assigneeName && t.assigneeName.toLowerCase().includes(q))
      );
    }

    return list;
  },

  renderCurrentTab() {
    if (this.currentTab === 'kanban') {
      Kanban.render();
    } else if (this.currentTab === 'projects') {
      Projects.render();
    } else if (this.currentTab === 'analytics') {
      Analytics.render();
    } else if (this.currentTab === 'team') {
      Team.render();
    } else if (this.currentTab === 'activities') {
      Analytics.renderActivities();
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update view panels
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabId}`);
    });

    // Show/hide subheader controls for Kanban
    const controls = document.getElementById('kanbanControls');
    if (controls) {
      controls.style.display = (tabId === 'kanban') ? 'flex' : 'none';
    }

    this.renderCurrentTab();
  },

  populateProjectFilterSelect() {
    const select = document.getElementById('projectFilterSelect');
    if (!select) return;

    const previousVal = select.value || 'all';

    select.innerHTML = `
      <option value="all">📁 All Projects (${this.projects.length})</option>
      ${this.projects.map(p => `
        <option value="${p.id}" ${p.id === this.currentProjectId ? 'selected' : ''}>
          ${escapeHtml(p.code)} - ${escapeHtml(p.name)}
        </option>
      `).join('')}
    `;

    if (this.currentProjectId !== 'all') {
      select.value = this.currentProjectId;
    }
  },

  setupEventListeners() {
    // Project filter select
    const pSelect = document.getElementById('projectFilterSelect');
    if (pSelect) {
      pSelect.addEventListener('change', (e) => {
        this.currentProjectId = e.target.value;
        Kanban.render();
      });
    }

    // Search input with debounce
    const searchInput = document.getElementById('taskSearchInput');
    if (searchInput) {
      let timer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.searchQuery = e.target.value.trim();
          Kanban.render();
        }, 180);
      });
    }

    // Assignee filter chips (All vs My Tasks)
    document.querySelectorAll('.assignee-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.assignee-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilterAssignee = chip.dataset.assignee;
        Kanban.render();
      });
    });

    // Priority filter chips
    document.querySelectorAll('.priority-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.priority-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilterPriority = chip.dataset.priority;
        Kanban.render();
      });
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  async resetDemoData() {
    if (!confirm('Reset all projects, tasks, and members back to initial university demo state?')) {
      return;
    }

    try {
      await API.resetDemoData();
      this.currentProjectId = 'all';
      this.currentFilterAssignee = 'all';
      this.currentFilterPriority = 'all';
      this.searchQuery = '';

      this.showToast('Reset to university demo data successfully!', 'success');
      await this.refreshData();
      Kanban.render();
    } catch (err) {
      this.showToast('Failed to reset: ' + err.message, 'error');
    }
  },

  // Open Deployment & Cloud VM Info Modal
  openCloudModal() {
    const modal = document.getElementById('cloudModal');
    if (modal) modal.classList.add('show');
  },

  closeCloudModal() {
    const modal = document.getElementById('cloudModal');
    if (modal) modal.classList.remove('show');
  }
};

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
