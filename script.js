// Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoTime = document.getElementById('todo-time');
const todoList = document.getElementById('todo-list');
const showUpcomingBtn = document.getElementById('show-upcoming-btn');

// Event Listeners
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);
showUpcomingBtn.addEventListener('click', displayUpcomingTodos);

// Functions
function addTodo(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();
    const todoDateTime = todoTime.value;

    if (todoText === '' || todoDateTime === '') return;

    const todoItem = {
        text: todoText,
        dateTime: new Date(todoDateTime)
    };

    // Add new todo to the list and refresh the display
    saveTodoItem(todoItem);
    displayAllTodos();

    // Clear input fields
    todoInput.value = '';
    todoTime.value = '';
}

function handleTodoClick(event) {
    const target = event.target;

    if (target.classList.contains('delete-btn')) {
        const todoItem = target.parentElement;
        const todoIndex = todoItem.getAttribute('data-index');
        deleteTodoItem(todoIndex);
        displayAllTodos(); // Refresh to show all or upcoming based on current view
    } else {
        target.classList.toggle('completed');
    }
}

function formatDateTime(dateTime) {
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
}

// Save the new todo item to local storage
function saveTodoItem(todoItem) {
    let todos = getTodoItems();
    todos.push(todoItem);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Get all todo items from local storage
function getTodoItems() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

// Delete a todo item
function deleteTodoItem(index) {
    let todos = getTodoItems();
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Display all todo items
function displayAllTodos() {
    const todos = getTodoItems();
    displayTodos(todos);
}

// Display only upcoming todo items, sorted by time
function displayUpcomingTodos() {
    const todos = getTodoItems();
    const now = new Date();

    // Filter and sort by date
    const upcomingTodos = todos
        .filter(todo => new Date(todo.dateTime) >= now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    // Display filtered upcoming events
    displayTodos(upcomingTodos);
}

// Helper to display a list of todos
function displayTodos(todos) {
    // Clear the list
    todoList.innerHTML = '';

    // Add tasks to the list
    todos.forEach((todo, index) => {
        const todoItemElement = document.createElement('li');
        todoItemElement.setAttribute('data-index', index);

        const eventText = document.createElement('span');
        eventText.textContent = todo.text;

        const eventTime = document.createElement('span');
        eventTime.classList.add('time');
        eventTime.textContent = formatDateTime(todo.dateTime);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        todoItemElement.appendChild(eventText);
        todoItemElement.appendChild(eventTime);
        todoItemElement.appendChild(deleteBtn);
        todoList.appendChild(todoItemElement);
    });
}

// Load all events on page load
window.onload = function () {
    displayAllTodos();
}
