// Kanban Board Logic & Drag-and-Drop Implementation

const Kanban = {
  columns: [
    { id: 'todo', title: 'To Do', dotClass: 'todo' },
    { id: 'in_progress', title: 'In Progress', dotClass: 'in_progress' },
    { id: 'review', title: 'In Review', dotClass: 'review' },
    { id: 'completed', title: 'Completed', dotClass: 'completed' }
  ],

  init() {
    this.renderColumns();
  },

  renderColumns() {
    const container = document.getElementById('kanbanBoard');
    if (!container) return;

    container.innerHTML = this.columns.map(col => `
      <div class="kanban-column" id="col-${col.id}" data-status="${col.id}">
        <div class="column-header">
          <div class="column-title-group">
            <span class="column-dot ${col.dotClass}"></span>
            <span class="column-title">${col.title}</span>
            <span class="column-badge" id="count-${col.id}">0</span>
          </div>
          <button class="column-add-btn" title="Add Task to ${col.title}" onclick="Tasks.openCreateModal('${col.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
        <div class="column-card-list" id="list-${col.id}" 
             ondragover="Kanban.handleDragOver(event)" 
             ondragleave="Kanban.handleDragLeave(event)" 
             ondrop="Kanban.handleDrop(event, '${col.id}')">
          <!-- Cards dynamically injected -->
        </div>
      </div>
    `).join('');
  },

  render() {
    const tasks = App.getFilteredTasks();

    this.columns.forEach(col => {
      const colTasks = tasks.filter(t => t.status === col.id);
      const listEl = document.getElementById(`list-${col.id}`);
      const countEl = document.getElementById(`count-${col.id}`);

      if (countEl) countEl.textContent = colTasks.length;

      if (!listEl) return;

      if (colTasks.length === 0) {
        listEl.innerHTML = `
          <div class="column-empty">
            <p>No tasks in ${col.title}</p>
            <button class="btn btn-sm btn-outline" style="margin-top: 0.5rem;" onclick="Tasks.openCreateModal('${col.id}')">+ Add Task</button>
          </div>
        `;
      } else {
        listEl.innerHTML = colTasks.map(task => this.renderCardHtml(task)).join('');
      }
    });
  },

  renderCardHtml(task) {
    // Priority Pill
    const priorityLabels = {
      urgent: '🔥 Urgent',
      high: '🔺 High',
      medium: '⚡ Medium',
      low: '🟢 Low'
    };

    // Deadline format & status
    const deadlineStr = task.deadline || 'No deadline';
    let deadlineBadgeHtml = '';

    if (task.status === 'completed') {
      deadlineBadgeHtml = `<span class="deadline-badge deadline-done">✓ Completed</span>`;
    } else if (task.deadlineStatus === 'overdue') {
      deadlineBadgeHtml = `<span class="deadline-badge deadline-overdue" title="Overdue by ${Math.abs(task.diffDays)} days">⚠️ Overdue (${Math.abs(task.diffDays)}d)</span>`;
    } else if (task.deadlineStatus === 'today') {
      deadlineBadgeHtml = `<span class="deadline-badge deadline-today">⏰ Due Today</span>`;
    } else if (task.deadlineStatus === 'soon') {
      deadlineBadgeHtml = `<span class="deadline-badge deadline-soon">⏳ Due in ${task.diffDays}d</span>`;
    } else {
      deadlineBadgeHtml = `<span class="deadline-badge deadline-upcoming">📅 ${task.deadline}</span>`;
    }

    // Quick move action button
    let nextActionBtn = '';
    if (task.status === 'todo') {
      nextActionBtn = `<button class="task-action-btn" title="Start Working" onclick="Kanban.quickMove('${task.id}', 'in_progress', event)">Start ➔</button>`;
    } else if (task.status === 'in_progress') {
      nextActionBtn = `<button class="task-action-btn" title="Submit for Review" onclick="Kanban.quickMove('${task.id}', 'review', event)">Review ➔</button>`;
    } else if (task.status === 'review') {
      nextActionBtn = `<button class="task-action-btn" title="Approve & Complete" onclick="Kanban.quickMove('${task.id}', 'completed', event)">Done ✓</button>`;
    } else if (task.status === 'completed') {
      nextActionBtn = `<button class="task-action-btn" title="Reopen Task" onclick="Kanban.quickMove('${task.id}', 'todo', event)">↺ Reopen</button>`;
    }

    return `
      <div class="task-card" id="task-${task.id}" draggable="true" 
           ondragstart="Kanban.handleDragStart(event, '${task.id}')"
           ondragend="Kanban.handleDragEnd(event)"
           onclick="Tasks.openDetailModal('${task.id}')">
        
        <div class="task-meta-top">
          <span class="tag-pill">${escapeHtml(task.category || 'General')}</span>
          <span class="priority-pill priority-${task.priority}">
            ${priorityLabels[task.priority] || task.priority}
          </span>
        </div>

        <h4 class="task-title">${escapeHtml(task.title)}</h4>
        
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}

        <div class="task-project-tag">
          <span class="project-bullet" style="background: ${task.projectColor || '#6366f1'};"></span>
          <span>${escapeHtml(task.projectName)}</span>
        </div>

        <div class="task-card-footer">
          <div class="task-assignee" title="Assigned to ${escapeHtml(task.assigneeName)}">
            <div class="assignee-avatar-sm" style="background: ${task.assigneeColor || '#6366f1'};">
              ${task.assigneeInitials || 'ST'}
            </div>
            <span class="assignee-name-sm">${escapeHtml(task.assigneeName)}</span>
          </div>
          <div>${deadlineBadgeHtml}</div>
        </div>

        <div class="task-actions-bar" onclick="event.stopPropagation()">
          ${nextActionBtn}
          <button class="task-action-btn" title="Edit Task" onclick="Tasks.openEditModal('${task.id}', event)">✎</button>
          <button class="task-action-btn btn-delete" title="Delete Task" onclick="Tasks.deleteTask('${task.id}', event)">✕</button>
        </div>
      </div>
    `;
  },

  // Drag and Drop Event Handlers
  handleDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    const card = document.getElementById(`task-${taskId}`);
    if (card) {
      setTimeout(() => card.classList.add('dragging'), 0);
    }
  },

  handleDragEnd(e) {
    document.querySelectorAll('.task-card.dragging').forEach(c => c.classList.remove('dragging'));
    document.querySelectorAll('.kanban-column.drag-over').forEach(c => c.classList.remove('drag-over'));
  },

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = e.currentTarget.closest('.kanban-column');
    if (col && !col.classList.contains('drag-over')) {
      col.classList.add('drag-over');
    }
  },

  handleDragLeave(e) {
    const col = e.currentTarget.closest('.kanban-column');
    if (col) {
      col.classList.remove('drag-over');
    }
  },

  async handleDrop(e, targetStatus) {
    e.preventDefault();
    const col = e.currentTarget.closest('.kanban-column');
    if (col) col.classList.remove('drag-over');

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = App.tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    // Optimistic UI update
    const previousStatus = task.status;
    task.status = targetStatus;
    this.render();

    try {
      await API.updateTask(taskId, { status: targetStatus });
      App.showToast(`Task moved to ${this.getStatusLabel(targetStatus)}`, 'success');
      App.refreshData(false); // background sync
    } catch (err) {
      task.status = previousStatus;
      this.render();
      App.showToast('Failed to update task status: ' + err.message, 'error');
    }
  },

  async quickMove(taskId, newStatus, e) {
    if (e) e.stopPropagation();
    const task = App.tasks.find(t => t.id === taskId);
    if (!task) return;

    const prev = task.status;
    task.status = newStatus;
    this.render();

    try {
      await API.updateTask(taskId, { status: newStatus });
      App.showToast(`Status updated to ${this.getStatusLabel(newStatus)}`, 'success');
      App.refreshData(false);
    } catch (err) {
      task.status = prev;
      this.render();
      App.showToast('Failed to change status: ' + err.message, 'error');
    }
  },

  getStatusLabel(status) {
    const map = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'In Review',
      completed: 'Completed'
    };
    return map[status] || status;
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
