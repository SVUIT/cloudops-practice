import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} — <strong>{task.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPage;
