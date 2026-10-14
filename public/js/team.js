// Team Management & Profile Switcher Module

const Team = {
  render() {
    this.renderRoster();
    this.renderNavProfile();
  },

  renderNavProfile() {
    const active = App.activeMember;
    if (!active) return;

    const navAvatar = document.getElementById('navUserAvatar');
    const navName = document.getElementById('navUserName');
    const navRole = document.getElementById('navUserRole');

    if (navAvatar) {
      navAvatar.style.background = active.avatarColor || '#6366f1';
      navAvatar.textContent = active.initials || 'ST';
    }
    if (navName) navName.textContent = active.name;
    if (navRole) navRole.textContent = active.role;

    // Render dropdown items
    const dropdownList = document.getElementById('memberDropdownList');
    if (dropdownList) {
      dropdownList.innerHTML = App.members.map(m => `
        <div class="dropdown-item ${m.id === active.id ? 'active' : ''}" onclick="Team.switchProfile('${m.id}')">
          <div class="avatar" style="background: ${m.avatarColor}; width: 28px; height: 28px; font-size: 0.7rem;">${m.initials}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.82rem;">${escapeHtml(m.name)}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">${escapeHtml(m.role)}</div>
          </div>
        </div>
      `).join('');
    }
  },

  renderRoster() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    const tasks = App.tasks;

    grid.innerHTML = App.members.map(m => {
      const mTasks = tasks.filter(t => t.assigneeId === m.id);
      const mCompleted = mTasks.filter(t => t.status === 'completed').length;
      const mPending = mTasks.length - mCompleted;
      const isActive = App.activeMember?.id === m.id;

      return `
        <div class="member-card" style="${isActive ? 'border-color: var(--primary); background: rgba(99, 102, 241, 0.08);' : ''}">
          <div class="member-card-top">
            <div class="avatar avatar-lg" style="background: ${m.avatarColor};">
              ${m.initials}
            </div>
            <div>
              <div class="member-card-name">${escapeHtml(m.name)} ${isActive ? '<span style="font-size: 0.7rem; color: var(--primary); font-weight: normal;">(Active You)</span>' : ''}</div>
              <div class="member-card-role">${escapeHtml(m.role)}</div>
              <div class="member-card-email">${escapeHtml(m.email)}</div>
            </div>
          </div>

          <div class="member-stats-box">
            <div>
              <div class="member-stat-num" style="color: var(--cyan);">${mPending}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Active Tasks</div>
            </div>
            <div>
              <div class="member-stat-num" style="color: var(--emerald);">${mCompleted}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Completed</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-top: auto;">
            ${isActive ? `
              <button class="btn btn-sm btn-primary" style="width: 100%; cursor: default;">
                ✓ Active Profile
              </button>
            ` : `
              <button class="btn btn-sm btn-secondary" style="width: 100%;" onclick="Team.switchProfile('${m.id}')">
                Switch to this Profile
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  async switchProfile(memberId) {
    try {
      await API.setActiveMember(memberId);
      const member = App.members.find(m => m.id === memberId);
      App.activeMember = member;
      API.setActorId(memberId);
      
      this.closeDropdown();
      this.renderNavProfile();
      this.renderRoster();
      
      App.showToast(`Switched active profile to ${member.name}`, 'info');

      // If filter is currently on "My Tasks", refresh Kanban
      if (App.currentFilterAssignee === 'my_tasks') {
        Kanban.render();
      }
    } catch (err) {
      App.showToast('Failed to switch profile: ' + err.message, 'error');
    }
  },

  toggleDropdown() {
    const menu = document.getElementById('memberDropdownMenu');
    if (menu) menu.classList.toggle('show');
  },

  closeDropdown() {
    const menu = document.getElementById('memberDropdownMenu');
    if (menu) menu.classList.remove('show');
  },

  openAddModal() {
    this.closeDropdown();
    const modal = document.getElementById('memberModal');
    if (!modal) return;
    document.getElementById('memberForm').reset();
    modal.classList.add('show');
  },

  closeAddModal() {
    const modal = document.getElementById('memberModal');
    if (modal) modal.classList.remove('show');
  },

  async handleAddSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.memberName.value.trim(),
      role: form.memberRole.value.trim(),
      email: form.memberEmail.value.trim(),
      avatarColor: form.memberColor.value
    };

    if (!payload.name) {
      App.showToast('Name is required', 'error');
      return;
    }

    try {
      const created = await API.createMember(payload);
      App.showToast(`Added team member ${created.name}!`, 'success');
      this.closeAddModal();
      await App.refreshData(true);
      this.render();
    } catch (err) {
      App.showToast('Failed to add member: ' + err.message, 'error');
    }
  }
};

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
  if (!e.target.closest('#memberDropdownContainer')) {
    Team.closeDropdown();
  }
});
