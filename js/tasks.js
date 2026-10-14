// Tasks Management & Modal Controller

const Tasks = {
  openCreateModal(defaultStatus = 'todo') {
    const modal = document.getElementById('taskModal');
    if (!modal) return;

    document.getElementById('taskModalTitle').textContent = 'Create New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskIdInput').value = '';

    // Populate projects dropdown
    const projectSelect = document.getElementById('taskProjectSelect');
    if (projectSelect) {
      projectSelect.innerHTML = App.projects.map(p => `
        <option value="${p.id}" ${p.id === App.currentProjectId ? 'selected' : ''}>
          ${escapeHtml(p.name)} (${escapeHtml(p.code)})
        </option>
      `).join('');
    }

    // Populate assignees dropdown
    const assigneeSelect = document.getElementById('taskAssigneeSelect');
    if (assigneeSelect) {
      assigneeSelect.innerHTML = App.members.map(m => `
        <option value="${m.id}" ${m.id === App.activeMember?.id ? 'selected' : ''}>
          ${escapeHtml(m.name)} - ${escapeHtml(m.role)}
        </option>
      `).join('');
    }

    // Default status & deadline
    document.getElementById('taskStatusSelect').value = defaultStatus;
    const defaultDeadline = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    document.getElementById('taskDeadlineInput').value = defaultDeadline;

    modal.classList.add('show');
  },

  openEditModal(taskId, e) {
    if (e) e.stopPropagation();
    const task = App.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('taskModal');
    if (!modal) return;

    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskIdInput').value = task.id;
    document.getElementById('taskTitleInput').value = task.title;
    document.getElementById('taskDescInput').value = task.description || '';
    document.getElementById('taskCategoryInput').value = task.category || '';
    document.getElementById('taskPrioritySelect').value = task.priority || 'medium';
    document.getElementById('taskStatusSelect').value = task.status || 'todo';
    document.getElementById('taskDeadlineInput').value = task.deadline || '';

    // Populate projects dropdown
    const projectSelect = document.getElementById('taskProjectSelect');
    if (projectSelect) {
      projectSelect.innerHTML = App.projects.map(p => `
        <option value="${p.id}" ${p.id === task.projectId ? 'selected' : ''}>
          ${escapeHtml(p.name)} (${escapeHtml(p.code)})
        </option>
      `).join('');
    }

    // Populate assignees dropdown
    const assigneeSelect = document.getElementById('taskAssigneeSelect');
    if (assigneeSelect) {
      assigneeSelect.innerHTML = App.members.map(m => `
        <option value="${m.id}" ${m.id === task.assigneeId ? 'selected' : ''}>
          ${escapeHtml(m.name)} - ${escapeHtml(m.role)}
        </option>
      `).join('');
    }

    modal.classList.add('show');
  },

  openDetailModal(taskId) {
    const task = App.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    document.getElementById('detailTaskTitle').textContent = task.title;
    document.getElementById('detailTaskDesc').textContent = task.description || 'No detailed description provided.';
    document.getElementById('detailTaskCategory').textContent = task.category || 'General';
    document.getElementById('detailTaskProject').textContent = task.projectName;
    document.getElementById('detailTaskDeadline').textContent = task.deadline;
    document.getElementById('detailTaskAssignee').textContent = `${task.assigneeName} (${task.assigneeInitials})`;
    document.getElementById('detailTaskStatus').value = task.status;
    document.getElementById('detailTaskPriority').textContent = task.priority.toUpperCase();

    // Store current task id on modal element
    modal.dataset.currentTaskId = taskId;

    modal.classList.add('show');
  },

  closeModal() {
    const modal = document.getElementById('taskModal');
    if (modal) modal.classList.remove('show');
  },

  closeDetailModal() {
    const modal = document.getElementById('taskDetailModal');
    if (modal) modal.classList.remove('show');
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const taskId = document.getElementById('taskIdInput').value;

    const payload = {
      title: form.taskTitle.value.trim(),
      description: form.taskDesc.value.trim(),
      projectId: form.taskProject.value,
      assigneeId: form.taskAssignee.value,
      priority: form.taskPriority.value,
      category: form.taskCategory.value.trim() || 'General',
      deadline: form.taskDeadline.value,
      status: form.taskStatus.value
    };

    if (!payload.title) {
      App.showToast('Please provide a task title', 'error');
      return;
    }

    try {
      if (taskId) {
        await API.updateTask(taskId, payload);
        App.showToast('Task updated successfully', 'success');
      } else {
        await API.createTask(payload);
        App.showToast(`Task "${payload.title}" created!`, 'success');
      }

      this.closeModal();
      await App.refreshData(true);
      Kanban.render();
    } catch (err) {
      App.showToast('Failed to save task: ' + err.message, 'error');
    }
  },

  async handleDetailStatusChange(newStatus) {
    const modal = document.getElementById('taskDetailModal');
    const taskId = modal?.dataset.currentTaskId;
    if (!taskId) return;

    try {
      await API.updateTask(taskId, { status: newStatus });
      App.showToast(`Task status changed to ${Kanban.getStatusLabel(newStatus)}`, 'success');
      this.closeDetailModal();
      await App.refreshData(true);
      Kanban.render();
    } catch (err) {
      App.showToast('Failed to update status: ' + err.message, 'error');
    }
  },

  async deleteTask(taskId, e) {
    if (e) e.stopPropagation();
    const task = App.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!confirm(`Delete task "${task.title}"?`)) return;

    try {
      await API.deleteTask(taskId);
      App.showToast('Task deleted', 'info');
      await App.refreshData(true);
      Kanban.render();
    } catch (err) {
      App.showToast('Failed to delete task: ' + err.message, 'error');
    }
  }
};
