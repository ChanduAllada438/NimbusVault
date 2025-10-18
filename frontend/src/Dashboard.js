import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Typography, Box, List, ListItem, ListItemText, IconButton, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

function Dashboard({ token, onLogout }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      setError('Failed to fetch files');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      setError('Upload failed');
      setOpenSnack(true);
    } finally {
      setLoading(false);
    }
  };


const handleDownload = async (filename) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/files/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (err) {
    setError('Download failed: ' + (err.response?.statusText || err.message));
    console.error('Download error:', err.response || err);
  }
};

  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="outlined" color="secondary" onClick={onLogout}>Logout</Button>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Paper
            ref={dropRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            sx={{ p: 2, flex: 1, textAlign: 'center', borderStyle: 'dashed' }}
          >
            <Typography variant="subtitle1">Drag & drop files here</Typography>
            <Typography variant="body2" color="text.secondary">or</Typography>
            <input id="file-input" type="file" onChange={handleFileChange} style={{ marginTop: 12 }} />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleUpload} disabled={!selectedFile || loading}>
                {loading ? <CircularProgress size={18} color="inherit" /> : 'Upload'}
              </Button>
              {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>{selectedFile.name}</Typography>}
            </Box>
          </Paper>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Your Files</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <List>
              {files.map(file => (
                <ListItem key={file._id} secondaryAction={
                  <IconButton edge="end" onClick={() => handleDownload(file.filename)}>
                    <DownloadIcon />
                  </IconButton>
                }>
                  <ListItemText primary={file.originalname} secondary={new Date(file.uploadedAt || file.createdAt || Date.now()).toLocaleString()} />
                </ListItem>
              ))}
              {files.length === 0 && <Typography variant="body2" color="text.secondary">No files uploaded yet.</Typography>}
            </List>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={openSnack} autoHideDuration={4000} onClose={() => setOpenSnack(false)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
