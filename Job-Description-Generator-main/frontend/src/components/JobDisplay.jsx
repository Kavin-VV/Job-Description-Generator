import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Box,
    Divider,
    Grid
} from '@mui/material';

const JobDisplay = ({ descriptions }) => {
    if (!descriptions || descriptions.length === 0) return null;

    return (
        <Box sx={{ mt: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Generated Descriptions
            </Typography>
            <Grid container spacing={3}>
                {descriptions.map((job, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Option {index + 1}: {job.designation}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Experience: {job.experience} Years
                                    </Typography>
                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {job.skills.map((skill, i) => (
                                            <Chip key={i} label={skill} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>

                                <Typography variant="body2" paragraph sx={{ mb: 2, fontStyle: 'italic' }}>
                                    {job.description}
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Key Responsibilities
                                </Typography>
                                <List dense>
                                    {job.responsibilities.map((resp, i) => (
                                        <ListItem key={i} disablePadding>
                                            <ListItemText
                                                primary={resp}
                                                primaryTypographyProps={{ variant: 'body2' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Requirements
                                </Typography>
                                <List dense>
                                    {job.requirements.map((req, i) => (
                                        <ListItem key={i} disablePadding>
                                            <ListItemText
                                                primary={req}
                                                primaryTypographyProps={{ variant: 'body2' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default JobDisplay;
