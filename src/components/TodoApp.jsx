import { useEffect, useState } from "react";

function TodoApp() {
    const [tasks, setTasks] = useState([]);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState("all");
    const [taskInput, setTaskInput] = useState("");
    const [priority, setPriority] = useState("Medium Priority");

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
        setTasks(savedTasks);
        setHistory(savedHistory);
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    const logHistory = (action, text) => {
        const time = new Date().toLocaleTimeString();
        const entry = `[${time}] ${action}: "${text}"`;
        setHistory((prev) => [entry, ...prev]);
    };

    const addTask = () => {
        const text = taskInput.trim();
        if (!text) return;
        const newTask = { text, completed: false, priority };
        setTasks([...tasks, newTask]);
        logHistory("Added", text);
        setTaskInput("");
    };

    const toggleComplete = (index) => {
        const updated = [...tasks];
        updated[index].completed = !updated[index].completed;
        setTasks(updated);
        logHistory(updated[index].completed ? "Completed" : "Reopened", updated[index].text);
    };

    const editTask = (index) => {
        const old = tasks[index].text;
        const newText = prompt("Edit your task:", old);
        if (newText && newText.trim()) {
            const updated = [...tasks];
            updated[index].text = newText.trim();
            setTasks(updated);
            logHistory("Edited", `${old} → ${newText.trim()}`);
        }
    };

    const deleteTask = (index) => {
        const removed = tasks[index].text;
        const updated = tasks.filter((_, i) => i !== index);
        setTasks(updated);
        logHistory("Deleted", removed);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    return (
        <div className="todo-container">
            <h1>My To-Do List</h1>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Low Priority</option>
                    <option>Medium Priority</option>
                    <option>High Priority</option>
                </select>
                <button onClick={addTask}>Add Task</button>
            </div>

            <div className="filters">
                {["all", "active", "completed", "history"].map((type) => (
                    <button key={type} onClick={() => setFilter(type)}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
                <button onClick={clearHistory}>Clear History</button>
            </div>

            {filter === "history" ? (
                <ul id="taskHistory">
                    {history.length === 0 ? <p>No history to show</p> : history.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
            ) : (
                <>
                    <ul id="taskList">
                        {filteredTasks.length === 0 ? (
                            <p id="emptyMsg">No tasks to show</p>
                        ) : (
                            filteredTasks.map((task, i) => (
                                <li key={i}>
                                    <span
                                        onClick={() => toggleComplete(i)}
                                        onDoubleClick={() => editTask(i)}
                                        style={{ textDecoration: task.completed ? "line-through" : "none" }}
                                    >
                                        {task.text} ({task.priority})
                                    </span>
                                    <button className="edit-btn" onClick={() => editTask(i)}>✏️</button>
                                    <button className="delete-btn" onClick={() => deleteTask(i)}>🗑️</button>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}

export default TodoApp;
