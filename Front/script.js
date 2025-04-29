const API_BASE_URL = 'https://localhost:7063/api/ManagerTasks';

document.addEventListener('DOMContentLoaded', () => {
    const tasksTable = document.getElementById('tasks-body');
    const taskForm = document.querySelector('.task-form');
    const taskIdInput = document.getElementById('task-id');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');
    const completionDateInput = document.getElementById('completion-date');
    const completionDateGroup = document.getElementById('completion-date-group');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');
    const statusFilter = document.getElementById('status-filter');
    const refreshBtn = document.getElementById('refresh-btn');

    let isEditing = false;
    let currentTaskId = null;

    statusInput.addEventListener('change', toggleCompletionDateVisibility);
    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', resetForm);
    refreshBtn.addEventListener('click', loadTasks);
    statusFilter.addEventListener('change', filterTasks);

    loadTasks();

    async function loadTasks() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Erro ao carregar tarefas');
            
            const tasks = await response.json();
            renderTasks(tasks);
            filterTasks();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar tarefas');
        }
    }

    function renderTasks(tasks) {
        tasksTable.innerHTML = '';
        
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.dataset.id = task.id;
            row.dataset.status = task.status || 'unknown';

            const status = String(task.status || '').toLowerCase();
            const statusDisplay = task.status || 'Desconhecido';
            
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || '-'}</td>
                <td class="status-${String(task.status || '').toLowerCase()}">${task.status}</td>
                <td>${formatDate(task.creationDate)}</td>
                <td>${task.completionDate ? formatDate(task.completionDate) : '-'}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${task.id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${task.id}">Excluir</button>
                </td>
            `;
            
            tasksTable.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    function filterTasks() {
        const status = statusFilter.value;
        const rows = tasksTable.querySelectorAll('tr');
        console.log(rows);
        
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    async function handleEdit(e) {
        const taskId = e.target.dataset.id;
        
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`);
            if (!response.ok) throw new Error('Erro ao carregar tarefa');
            
            const task = await response.json();

            taskIdInput.value = task.id;
            titleInput.value = task.title;
            descriptionInput.value = task.description || '';
            statusInput.value = task.status;
            
            if (task.completionDate) {
                completionDateInput.value = new Date(task.completionDate).toISOString().slice(0, 16);
            }
            
            toggleCompletionDateVisibility();
            
            isEditing = true;
            formTitle.textContent = 'Editar Tarefa';
            saveBtn.textContent = 'Atualizar';
            cancelBtn.style.display = 'inline-block';

            taskForm.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar tarefa para edição');
        }
    }

    async function handleDelete(e) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        
        const taskId = e.target.dataset.id;
        
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Erro ao excluir tarefa');
            
            loadTasks();
            alert('Tarefa excluída com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir tarefa');
        }
    }

    async function handleSave() {
        // Validação básica
        if (!titleInput.value.trim()) {
            alert('O título é obrigatório!');
            return;
        }

        let taskData;
        if(taskIdInput.value){
            taskData = {
                id: taskIdInput.value,
                title: titleInput.value.trim(),
                description: descriptionInput.value.trim(),
                status: parseInt(statusInput.value),
                completionDate: statusInput.value === '2' 
                    ? (completionDateInput.value || new Date().toISOString())
                    : null
            };
        }else{
            taskData = {
                title: titleInput.value.trim(),
                description: descriptionInput.value.trim(),
                status: parseInt(statusInput.value),
                completionDate: statusInput.value === '2' 
                    ? (completionDateInput.value || new Date().toISOString())
                    : null
            };
        }
        
        try {
            let response;
            
            if (isEditing) {
                response = await fetch(`${API_BASE_URL}/${taskIdInput.value}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
            } else {

                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
            }
            
            console.log(response.ok);
            if (!response.ok) throw new Error('Erro ao salvar tarefa');
            
            resetForm();
            loadTasks();
            alert(`Tarefa ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar tarefa');
        }
    }

    function resetForm() {
        taskIdInput.value = '';
        isEditing = false;
        formTitle.textContent = 'Adicionar Nova Tarefa';
        saveBtn.textContent = 'Salvar';
        cancelBtn.style.display = 'none';
        completionDateGroup.style.display = 'none';
    }

    function toggleCompletionDateVisibility() {
        if (statusInput.value === '2') {
            completionDateGroup.style.display = 'block';
            if (!completionDateInput.value) {
                completionDateInput.value = new Date().toISOString().slice(0, 16);
            }
        } else {
            completionDateGroup.style.display = 'none';
            completionDateInput.value = '';
        }
    }

    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});