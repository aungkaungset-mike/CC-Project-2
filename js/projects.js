// Projects Management Module

const Projects = {
  render() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const projects = App.projects;

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="column-empty" style="grid-column: 1 / -1; padding: 4rem 1rem;">
          <h3>No Projects Created Yet</h3>
          <p>Create your first student semester project to get started!</p>
          <button class="btn btn-primary" style="margin-top: 1rem;" onclick="Projects.openCreateModal()">+ Create Project</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = projects.map(p => this.renderProjectCardHtml(p)).join('');
  },

  renderProjectCardHtml(p) {
    const stats = p.taskStats || { total: 0, completed: 0, inProgress: 0, review: 0, todo: 0 };
    const membersList = (p.members || []).map(mId => App.members.find(m => m.id === mId)).filter(Boolean);

    // Days left calculation
    const now = new Date();
    const deadlineDate = new Date(p.deadline + 'T23:59:59');
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    let deadlineBadge = '';
    if (p.isOverdue) {
      deadlineBadge = `<span class="deadline-badge deadline-overdue">⚠️ Overdue by ${Math.abs(diffDays)}d</span>`;
    } else if (diffDays <= 3) {
      deadlineBadge = `<span class="deadline-badge deadline-soon">⏳ Due in ${diffDays}d</span>`;
    } else {
      deadlineBadge = `<span class="deadline-badge deadline-upcoming">📅 ${p.deadline}</span>`;
    }

    const memberAvatarsHtml = membersList.map(m => `
      <div class="avatar" style="background: ${m.avatarColor}; width: 28px; height: 28px; font-size: 0.65rem;" title="${escapeHtml(m.name)} (${escapeHtml(m.role)})">
        ${m.initials}
      </div>
    `).join('');

    return `
      <div class="project-card" style="--project-color: ${p.color || '#6366f1'};">
        <div class="project-card-header">
          <div>
            <span class="project-code-badge">${escapeHtml(p.code || 'PRJ')}</span>
            <span class="tag-pill" style="margin-left: 0.5rem;">${escapeHtml(p.category || 'General')}</span>
          </div>
          <div>${deadlineBadge}</div>
        </div>

        <h3 class="project-card-title">${escapeHtml(p.name)}</h3>
        <p class="project-card-desc">${escapeHtml(p.description || 'No description provided.')}</p>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-header">
            <span class="progress-label">Semester Progress</span>
            <span class="progress-pct">${p.progress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar-fill" style="width: ${p.progress}%; background: linear-gradient(90deg, ${p.color || '#6366f1'}, #06b6d4);"></div>
          </div>
        </div>

        <!-- Task Stats Pills -->
        <div class="project-stats-row">
          <span class="p-stat-pill">📋 ${stats.total} Tasks</span>
          <span class="p-stat-pill" style="color: #6ee7b7;">✓ ${stats.completed} Done</span>
          <span class="p-stat-pill" style="color: #67e8f9;">⚡ ${stats.inProgress} In Progress</span>
          <span class="p-stat-pill" style="color: #fcd34d;">🔍 ${stats.review} Review</span>
        </div>

        <!-- Footer with Members and Kanban View button -->
        <div class="project-card-actions">
          <div class="avatar-group">
            ${memberAvatarsHtml}
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-secondary" onclick="Projects.filterToKanban('${p.id}')">
              View Kanban ➔
            </button>
            <button class="btn btn-sm btn-outline btn-icon-only" title="Delete Project" onclick="Projects.deleteProject('${p.id}')">
              🗑
            </button>
          </div>
        </div>
      </div>
    `;
  },

  filterToKanban(projectId) {
    App.currentProjectId = projectId;
    const select = document.getElementById('projectFilterSelect');
    if (select) select.value = projectId;
    App.switchTab('kanban');
    Kanban.render();
  },

  openCreateModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    document.getElementById('projectModalTitle').textContent = 'Create Student Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectIdInput').value = '';

    // Populate team members checkbox list
    const membersContainer = document.getElementById('projectMembersCheckboxes');
    if (membersContainer) {
      membersContainer.innerHTML = App.members.map(m => `
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
          <input type="checkbox" name="projectMembers" value="${m.id}" checked>
          <div class="avatar" style="background: ${m.avatarColor}; width: 22px; height: 22px; font-size: 0.6rem;">${m.initials}</div>
          <span>${escapeHtml(m.name)} <small style="color: var(--text-muted)">(${escapeHtml(m.role)})</small></span>
        </label>
      `).join('');
    }

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    document.getElementById('projectStartDate').value = today;
    document.getElementById('projectDeadline').value = twoWeeks;

    modal.classList.add('show');
  },

  closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('show');
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const projectId = document.getElementById('projectIdInput').value;

    const selectedMembers = Array.from(form.querySelectorAll('input[name="projectMembers"]:checked')).map(cb => cb.value);

    const payload = {
      name: form.projectName.value.trim(),
      code: form.projectCode.value.trim(),
      category: form.projectCategory.value.trim(),
      description: form.projectDesc.value.trim(),
      startDate: form.projectStartDate.value,
      deadline: form.projectDeadline.value,
      color: form.projectColor.value,
      members: selectedMembers
    };

    if (!payload.name) {
      App.showToast('Please enter a project name', 'error');
      return;
    }

    try {
      if (projectId) {
        await API.updateProject(projectId, payload);
        App.showToast('Project updated successfully', 'success');
      } else {
        await API.createProject(payload);
        App.showToast(`Project "${payload.name}" created!`, 'success');
      }

      this.closeModal();
      await App.refreshData(true);
      this.render();
    } catch (err) {
      App.showToast('Failed to save project: ' + err.message, 'error');
    }
  },

  async deleteProject(id) {
    const project = App.projects.find(p => p.id === id);
    if (!project) return;

    if (!confirm(`Are you sure you want to delete "${project.name}" and all its tasks?`)) {
      return;
    }

    try {
      await API.deleteProject(id);
      App.showToast('Project deleted', 'info');
      if (App.currentProjectId === id) {
        App.currentProjectId = 'all';
      }
      await App.refreshData(true);
      this.render();
    } catch (err) {
      App.showToast('Failed to delete project: ' + err.message, 'error');
    }
  }
};
