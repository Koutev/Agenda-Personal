import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        date: new Date()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveToNextDay = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const nextDay = new Date(task.date);
        nextDay.setDate(nextDay.getDate() + 1);
        return { ...task, date: nextDay, completed: false };
      }
      return task;
    }));
  };

  const today = new Date();
  const todayTasks = tasks.filter(task => 
    task.date.toDateString() === today.toDateString()
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mi Agenda Personal
          </Typography>
          <Typography variant="subtitle1">
            {format(today, "EEEE d 'de' MMMM", { locale: es })}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nueva tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
              startIcon={<AddIcon />}
            >
              Agregar
            </Button>
          </Box>
        </Paper>

        <List>
          {todayTasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                textDecoration: task.completed ? 'line-through' : 'none'
              }}
            >
              <ListItemText primary={task.text} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => toggleTask(task.id)}
                  color={task.completed ? "success" : "default"}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => moveToNextDay(task.id)}
                >
                  <ArrowForwardIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => deleteTask(task.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default App; 