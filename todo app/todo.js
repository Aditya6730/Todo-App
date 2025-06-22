// Todo App State
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let currentFilter = 'all';

        // DOM Elements
        const todoListEl = document.getElementById('todo-list');
        const addTodoForm = document.getElementById('add-todo-form');
        const newTodoInput = document.getElementById('new-todo');
        const prioritySelect = document.getElementById('priority');
        const remainingCountEl = document.getElementById('remaining-count');
        const clearCompletedBtn = document.getElementById('clear-completed');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Initialize the app
        function init() {
            renderTodos();
            updateStats();
            setupEventListeners();
        }

        // Set up event listeners
        function setupEventListeners() {
            addTodoForm.addEventListener('submit', handleAddTodo);
            clearCompletedBtn.addEventListener('click', handleClearCompleted);
            
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentFilter = btn.dataset.filter;
                    updateActiveFilterButton();
                    renderTodos();
                });
            });
        }

        // Update which filter button is active
        function updateActiveFilterButton() {
            filterButtons.forEach(btn => {
                if (btn.dataset.filter === currentFilter) {
                    btn.classList.add('bg-white', 'shadow-sm');
                    btn.classList.remove('text-gray-500');
                    btn.classList.add('text-indigo-600');
                } else {
                    btn.classList.remove('bg-white', 'shadow-sm');
                    btn.classList.add('text-gray-500');
                    btn.classList.remove('text-indigo-600');
                }
            });
        }

        // Handle adding a new todo
        function handleAddTodo(e) {
            e.preventDefault();
            
            const text = newTodoInput.value.trim();
            if (!text) return;
            
            const newTodo = {
                id: Date.now(),
                text: text,
                completed: false,
                priority: prioritySelect.value,
                createdAt: new Date().toISOString()
            };
            
            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
            updateStats();
            
            newTodoInput.value = '';
            newTodoInput.focus();
        }

        // Handle toggling todo completion
        function handleToggleTodo(id) {
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Handle deleting a todo
        function handleDeleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Handle clearing completed todos
        function handleClearCompleted() {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Save todos to localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Update stats display
        function updateStats() {
            const remaining = todos.filter(todo => !todo.completed).length;
            remainingCountEl.textContent = `${remaining} ${remaining === 1 ? 'item' : 'items'} left`;
        }

        // Render todos based on current filter
        function renderTodos() {
            const filteredTodos = todos.filter(todo => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'active') return !todo.completed;
                if (currentFilter === 'completed') return todo.completed;
                return true;
            });

            todoListEl.innerHTML = filteredTodos.length > 0 
                ? filteredTodos.map(renderTodo).join('') 
                : '<div class="text-center py-8 text-gray-500">No tasks found</div>';
        }

        // Render a single todo item
        function renderTodo(todo) {
            return `
                <div class="todo-item fade-in bg-white p-4 rounded-lg shadow-sm flex items-center justify-between ${todo.completed ? 'completed' : ''} priority-${todo.priority}">
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            ${todo.completed ? 'checked' : ''} 
                            onchange="handleToggleTodo(${todo.id})"
                            class="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-3"
                        >
                        <span class="text-lg">${todo.text}</span>
                        <span class="ml-2 text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(todo.priority)}">
                            ${todo.priority}
                        </span>
                    </div>
                    <button 
                        onclick="handleDeleteTodo(${todo.id})"
                        class="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
        }

        // Get priority badge class
        function getPriorityBadgeClass(priority) {
            switch (priority) {
                case 'high': return 'bg-red-100 text-red-800';
                case 'medium': return 'bg-yellow-100 text-yellow-800';
                case 'low': return 'bg-green-100 text-green-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        }

        // Expose functions to global scope for inline event handlers
        window.handleToggleTodo = handleToggleTodo;
        window.handleDeleteTodo = handleDeleteTodo;

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);