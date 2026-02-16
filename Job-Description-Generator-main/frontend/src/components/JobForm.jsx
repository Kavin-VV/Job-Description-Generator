import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Chip, 
  Stack, 
  Paper, 
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const JobForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    designation: '',
    yoe: '',
    currentSkill: '',
    skills: [],
    extraInfo: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && formData.currentSkill.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(formData.currentSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, formData.currentSkill.trim()],
          currentSkill: ''
        });
      }
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToDelete)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      designation: formData.designation,
      yoe: parseInt(formData.yoe),
      skills: formData.skills,
      extraInfo: formData.extraInfo
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Generate Job Description
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            required
            label="Job Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            type="number"
            label="Years of Experience"
            name="yoe"
            value={formData.yoe}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 50 }}
          />
          <Box>
            <TextField
              label="Skills (Press Enter to add)"
              name="currentSkill"
              value={formData.currentSkill}
              onChange={handleChange}
              onKeyDown={handleAddSkill}
              fullWidth
              helperText="Type a skill and press Enter"
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                />
              ))}
            </Box>
          </Box>
          <TextField
            label="Additional Information"
            name="extraInfo"
            value={formData.extraInfo}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="Any specific requirements, company culture, etc."
          />
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Generating...' : 'Generate Description'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default JobForm;
