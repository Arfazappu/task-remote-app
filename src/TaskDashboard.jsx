import { useEffect, useState } from 'react';
import supabase from '../supabase';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please login first.');
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setTasks(data || []);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTask, user_id: session?.user.id }])
      .select();

    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = async (task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id);

    if (!error) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add</button>
      {loading ? <p>Loading...</p> : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} onClick={() => toggleTask(task)}>
              {task.completed ? <s>{task.title}</s> : task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
