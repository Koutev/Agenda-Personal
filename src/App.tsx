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
  Toolbar,
  IconButton as MuiIconButton,
  Drawer,
  ListItemIcon,
  Divider,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Favorite as HealthIcon,
  Home as PersonalIcon,
  School as StudyIcon
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  category: string;
}

const categories = [
  { id: 'work', name: 'Trabajo', icon: <WorkIcon /> },
  { id: 'personal', name: 'Personal', icon: <PersonalIcon /> },
  { id: 'health', name: 'Salud', icon: <HealthIcon /> },
  { id: 'study', name: 'Estudio', icon: <StudyIcon /> }
];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

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
        date: selectedDate,
        category: selectedCategory
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

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || <PersonalIcon />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Mi Agenda Personal
            </Typography>
            <MuiIconButton 
              color="inherit" 
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </MuiIconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Nueva tarea..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                sx={{ flexGrow: 1 }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Categoría"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {getWeekDays().map((date) => (
              <Paper 
                key={date.toISOString()} 
                sx={{ 
                  p: 2, 
                  minWidth: 300,
                  bgcolor: date.toDateString() === new Date().toDateString() 
                    ? 'action.selected' 
                    : 'background.paper'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {format(date, "EEEE d 'de' MMMM", { locale: es })}
                </Typography>
                <List>
                  {getTasksForDate(date).map((task) => (
                    <ListItem
                      key={task.id}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        pr: 12,
                        width: '100%',
                        boxSizing: 'border-box',
                        position: 'relative'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 1, mt: 0.5 }}>
                        {getCategoryIcon(task.category)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.text}
                        sx={{
                          flexGrow: 1, 
                          flexShrink: 1,
                          minWidth: 0, 
                          mr: 1,
                          overflow: 'visible',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.5,
                        flexShrink: 0,
                        alignItems: 'center',
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleTask(task.id)}
                          color={task.completed ? "success" : "default"}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => moveToNextDay(task.id)}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteTask(task.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 