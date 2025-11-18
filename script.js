/* --- JAVASCRIPT (Logic) --- */

// 1. DOM Elements ko select karna
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');

// 2. Jab page load ho, tab LocalStorage se data lana
document.addEventListener('DOMContentLoaded', loadTasks);

// 3. Event Listeners add karna
addBtn.addEventListener('click', addTask);

// "Enter" key dabane par bhi task add ho
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// --- FUNCTIONS ---

function addTask() {
    const taskText = taskInput.value;

    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }

    // Task Object banana
    const task = {
        id: Date.now(), // Unique ID time ke hisaab se
        text: taskText,
        completed: false
    };

    // UI mein add karna
    createTaskElement(task);

    // LocalStorage mein save karna
    saveTaskToLocal(task);

    // Input clear karna
    taskInput.value = '';
    checkEmpty();
}

// DOM Manipulation: HTML elements create karna JS se
function createTaskElement(task) {
    // 'li' element banana
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    if (task.completed) {
        li.classList.add('completed');
    }

    // Text ke liye 'span' banana
    const span = document.createElement('span');
    span.className = 'task-text';
    span.innerText = task.text;
    
    // Click karne par complete mark karna
    span.addEventListener('click', () => {
        li.classList.toggle('completed');
        toggleTaskInLocal(task.id);
    });

    // Delete button banana
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;'; // 'x' symbol
    
    // Click karne par delete karna
    deleteBtn.addEventListener('click', () => {
        li.remove(); // DOM se hatana
        deleteTaskFromLocal(task.id); // Storage se hatana
        checkEmpty();
    });

    // Sabko jodna (Assemble)
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    checkEmpty();
}

// Check karna ki list khaali hai ya nahi
function checkEmpty() {
    if (taskList.children.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
    }
}

// --- LOCAL STORAGE FUNCTIONS (Data Save Rakhne Ke Liye) ---

function getTasksFromLocal() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function saveTaskToLocal(task) {
    const tasks = getTasksFromLocal();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocal();
    tasks.forEach(task => createTaskElement(task));
    checkEmpty();
}

function deleteTaskFromLocal(id) {
    let tasks = getTasksFromLocal();
    // Filter karke task hatana
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskInLocal(id) {
    let tasks = getTasksFromLocal();
    // Task dhoondh kar uska status badalna
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}