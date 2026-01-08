import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/auth/login', { email, password });
      onLogin(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      setOpenSnack(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField margin="normal" required fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>
            <Link component={RouterLink} to="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={openSnack} autoHideDuration={4000} onClose={() => setOpenSnack(false)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
