import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, Alert, Snackbar } from '@mui/material';
import JobForm from './components/JobForm';
import JobDisplay from './components/JobDisplay';
import axios from 'axios';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    const [descriptions, setDescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (formData) => {
        setLoading(true);
        setError(null);
        setDescriptions([]);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/generate-job-description/', formData);
            if (response.data.success) {
                setDescriptions(response.data.data);
            } else {
                setError('Failed to generate description');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'An error occurred while communicating with the server');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
                        Job Description Generator
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                        AI-Powered Job Descriptions (Django + React)
                    </Typography>

                    <JobForm onGenerate={handleGenerate} loading={loading} />
                    <JobDisplay descriptions={descriptions} />
                </Box>

                <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default App;
