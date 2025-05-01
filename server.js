const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Initialize Supabase client
const supabase = createClient('https://cwelmbwlnaxlfajpymhg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWxtYndsbmF4bGZhanB5bWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNzkwOTcsImV4cCI6MjA2MTY1NTA5N30.45sEihK7rNCEVc3OG7-Xz1WNyk9rooRKrzzqP--Diro');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-job', async (req, res) => {
  const {
    job_title,
    company_name,
    location,
    job_type,
    min_salary,
    max_salary,
    deadline,
    description,
  } = req.body;

  if (
    !job_title || !company_name || !location || !job_type ||
    !min_salary || !max_salary || !deadline || !description
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const jobData = {
    job_title,
    company_name,
    location,
    job_type,
    min_salary: parseInt(min_salary.replace(/[^\d]/g, '')),
    max_salary: parseInt(max_salary.replace(/[^\d]/g, '')),
    deadline,
    description,
     created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Job posted successfully!', data });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving the job.' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
