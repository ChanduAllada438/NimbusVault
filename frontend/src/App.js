import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import theme from './theme';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NimbusVault
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/dashboard" element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
