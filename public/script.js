const minSalary = document.getElementById("min-salary");
const maxSalary = document.getElementById("max-salary");
const salaryOutput = document.getElementById("salary-output");

function updateSalaryOutput() {
  let min = parseInt(minSalary.value);
  let max = parseInt(maxSalary.value);
  if (min > max) [minSalary.value, maxSalary.value] = [max, min]; // swap
  salaryOutput.textContent = `₹${Math.round(minSalary.value / 1000)}k - ₹${Math.round(maxSalary.value / 1000)}k`;


  minSalary.addEventListener("input", updateSalaryOutput);
  maxSalary.addEventListener("input", updateSalaryOutput);
  
  updateSalaryOutput(); // initial set
}
       const modal = document.getElementById("modalOverlay");
    const createBtn = document.querySelector(".create-job");
  
    createBtn.addEventListener("click", (e) => {
      e.preventDefault(); // prevent navigation if it's a link
      modal.style.display = "flex";
    });
  
    // Close modal on outside click
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

// form data saving

document.getElementById('jobForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission
  
    const jobData = {
      job_title: document.getElementById('jobTitle').value,
      company_name: document.getElementById('companyName').value,
      location: document.getElementById('jobLocation').value,
      job_type: document.getElementById('jobType').value,
      min_salary: document.getElementById('minSalary').value,
      max_salary: document.getElementById('maxSalary').value,
      deadline: document.getElementById('deadline').value,
      description: document.getElementById('jobDescription').value,
    };
  
    try {
      const response = await fetch('/submit-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Close the modal
        const modal = document.getElementById("modalOverlay");
        modal.style.display = "none";
        
        // Reset form
        document.getElementById('jobForm').reset();
        
        // Show success notification
        showNotification('✅ ' + result.message, 'success');
      } else {
        showNotification('❌ ' + result.error, 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('❌ Failed to submit job.', 'error');
    }
});

// Function to show notification at the top of the page
function showNotification(message, type) {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set notification properties
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '12px 24px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '1000';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.transition = 'opacity 0.5s ease';
  notification.style.opacity = '1';
  
  // Add color based on notification type
  if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#F44336';
    notification.style.color = 'white';
  }
  
  // Make notification visible
  notification.style.display = 'block';
  
  // Clear any existing timeout
  if (window.notificationTimeout) {
    clearTimeout(window.notificationTimeout);
  }
  
  // Hide notification after 5 seconds
  window.notificationTimeout = setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 500);
  }, 5000);
}
      
      //the jobs in find jobs

      document.addEventListener('DOMContentLoaded', function() {
        // Function to format time ago
        function timeAgo(dateString) {
          const now = new Date();
          const past = new Date(dateString);
          const diffInMillis = now - past;
          
          // Convert to hours
          const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
          
          if (diffInHours < 24) {
            return `${diffInHours}h ago`;
          } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
          }
        }
        
        // Function to fetch and display jobs
        async function fetchAndDisplayJobs() {
          const jobsContainer = document.getElementById('jobsContainer');
          
          try {
            console.log('Fetching jobs...');
            const response = await fetch('/api/jobs');
            
            if (!response.ok) {
              throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            
            const jobs = await response.json();
            console.log('Jobs fetched:', jobs);
            
            // Clear loading message
            jobsContainer.innerHTML = '';
            
            if (!jobs || jobs.length === 0) {
              jobsContainer.innerHTML = '<div class="no-jobs">No jobs available at this time.</div>';
              return;
            }
            
            // Create job cards
            jobs.forEach(job => {
              // Process company name for logo
              const logoName = job.company_name.toLowerCase().replace(/\s+/g, '') + '.png';
              
              // Create card element
              const jobCard = document.createElement('div');
              jobCard.className = 'job-card';
              
              // Format timestamp
              const postedTime = timeAgo(job.created_at);
              
              // Build card content
              jobCard.innerHTML = `
                <div class="card-header">
                  <div class="company-logo">
                    <img src="/assessts/${job.company_name}.png" alt="${job.company_name}" 
                         onerror="this.onerror=null; this.src='/assessts/swiggy.png';">
                  </div>
                  <div class="time-posted">${postedTime}</div>
                </div>
                <div class="job-title">${job.job_title}</div>
                <div class="job-details">
                  <span><img style="color:black;" src="assessts/exp.png"/> 1-3 yr Exp</span>
                  <span><img style="color:black;" src="assessts/jobtype.png"/>  Onsite</span>
                  <span><img style="color:black;" src="assessts/salary.png"/> 12 LPA</span>
                </div>
                <div class="job-description">
                  <ul>
                    <li>A user-friendly interface lets you browse stunning photos and videos.</li>
                    <li>Filter destinations based on interests and travel style, and create personalized.</li>
                  </ul>
                </div>
                <a href="#apply-${job.id}" class="apply-btn">Apply Now</a>
              `;
              
              // Add to container
              jobsContainer.appendChild(jobCard);
            });
            
          } catch (error) {
            console.error('Error fetching jobs:', error);
            jobsContainer.innerHTML = `
              <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 20px; color: #d32f2f;">
                Failed to load jobs: ${error.message}
                <br><button onclick="fetchAndDisplayJobs()" style="margin-top: 10px; padding: 5px 10px;">Try Again</button>
              </div>
            `;
          }
        }
        
        // Initialize job listing
        fetchAndDisplayJobs();
      });