// Analytics, Cloud VM Telemetry & Activity Feed Module

const Analytics = {
  render() {
    this.renderTelemetry();
    this.renderKPIs();
    this.renderWorkload();
    this.renderActivities();
  },

  async renderTelemetry() {
    try {
      const data = await API.getHealth();
      const sys = data.system;

      // Format uptime
      const hours = Math.floor(sys.uptimeSeconds / 3600);
      const minutes = Math.floor((sys.uptimeSeconds % 3600) / 60);
      const seconds = sys.uptimeSeconds % 60;
      const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

      const elHostname = document.getElementById('telemetryHostname');
      const elPlatform = document.getElementById('telemetryPlatform');
      const elUptime = document.getElementById('telemetryUptime');
      const elMemUsage = document.getElementById('telemetryMemUsage');
      const elCores = document.getElementById('telemetryCores');

      if (elHostname) elHostname.textContent = sys.hostname || 'Cloud VM';
      if (elPlatform) elPlatform.textContent = `${sys.platform} (Linux/UNIX)`;
      if (elUptime) elUptime.textContent = uptimeStr;
      if (elMemUsage) elMemUsage.textContent = `${sys.memory.usagePercent}% (${sys.memory.freeMB}MB free)`;
      if (elCores) elCores.textContent = `${sys.cpuCount} vCPUs`;
    } catch (err) {
      console.warn('Telemetry load failed:', err);
    }
  },

  renderKPIs() {
    const tasks = App.tasks;
    const projects = App.projects;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter(t => t.deadlineStatus === 'overdue').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const elTotalTasks = document.getElementById('kpiTotalTasks');
    const elCompletedTasks = document.getElementById('kpiCompletedTasks');
    const elCompletionRate = document.getElementById('kpiCompletionRate');
    const elOverdueTasks = document.getElementById('kpiOverdueTasks');
    const elInProgress = document.getElementById('kpiInProgress');

    if (elTotalTasks) elTotalTasks.textContent = totalTasks;
    if (elCompletedTasks) elCompletedTasks.textContent = completedTasks;
    if (elCompletionRate) elCompletionRate.textContent = `${completionRate}%`;
    if (elOverdueTasks) elOverdueTasks.textContent = overdueTasks;
    if (elInProgress) elInProgress.textContent = inProgressTasks;
  },

  renderWorkload() {
    const container = document.getElementById('workloadBarsContainer');
    if (!container) return;

    const tasks = App.tasks;
    const members = App.members;

    if (members.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted);">No team members registered.</p>';
      return;
    }

    // Find max tasks for proportional sizing
    const maxTasks = Math.max(...members.map(m => tasks.filter(t => t.assigneeId === m.id).length), 1);

    container.innerHTML = members.map(m => {
      const mTasks = tasks.filter(t => t.assigneeId === m.id);
      const total = mTasks.length;
      const completed = mTasks.filter(t => t.status === 'completed').length;
      const pending = total - completed;

      const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const pendingPct = 100 - completedPct;
      const widthPct = Math.max(Math.round((total / maxTasks) * 100), 10);

      return `
        <div class="workload-row">
          <div class="workload-info">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div class="avatar" style="background: ${m.avatarColor}; width: 24px; height: 24px; font-size: 0.65rem;">${m.initials}</div>
              <span style="font-weight: 600;">${escapeHtml(m.name)}</span>
              <span style="color: var(--text-muted); font-size: 0.75rem;">(${escapeHtml(m.role)})</span>
            </div>
            <div style="font-size: 0.8rem;">
              <span style="color: var(--emerald); font-weight: 600;">${completed} Done</span> / 
              <span style="color: var(--cyan); font-weight: 600;">${pending} Active</span> 
              <span style="color: var(--text-muted);">(${total} total)</span>
            </div>
          </div>
          <div class="workload-bar-track" style="width: ${widthPct}%;">
            <div class="workload-bar-completed" style="width: ${completedPct}%;" title="${completed} Completed"></div>
            <div class="workload-bar-pending" style="width: ${pendingPct}%;" title="${pending} Active"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  async renderActivities() {
    const listEl = document.getElementById('activityFeedList');
    if (!listEl) return;

    try {
      const activities = await API.getActivities(25);

      if (activities.length === 0) {
        listEl.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No recent activities logged.</p>';
        return;
      }

      listEl.innerHTML = activities.map(a => {
        const timeAgo = formatTimeAgo(new Date(a.timestamp));
        return `
          <div class="activity-item">
            <div class="avatar" style="background: ${a.memberColor}; width: 36px; height: 36px; font-size: 0.8rem; flex-shrink: 0;">
              ${a.memberInitials}
            </div>
            <div style="flex: 1;">
              <div class="activity-details">
                <strong>${escapeHtml(a.memberName)}</strong>: ${escapeHtml(a.details)}
              </div>
              <div class="activity-time">🕒 ${timeAgo} &bull; ${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.warn('Activity feed failed:', err);
    }
  }
};

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
