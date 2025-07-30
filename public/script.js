const minSlider = document.getElementById('min-salary');
    const maxSlider = document.getElementById('max-salary');
    const rangeDisplay = document.getElementById('salary-range-display');
    const activeTrack = document.getElementById('slider-track-active');
    
    // Format salary value to show in k format (e.g., 50000 -> 50k)
    function formatSalary(value) {
      return '₹' + (value / 1000) + 'k';
    }
    
    // Update the display and slider positioning
    function updateSalaryOutput() {
      // Ensure min doesn't exceed max
      if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
        minSlider.value = maxSlider.value;
      }
      
      // Update the display text
      rangeDisplay.textContent = formatSalary(minSlider.value) + ' - ' + formatSalary(maxSlider.value);
      
      // Update the active track position
      const percent1 = ((minSlider.value - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
      const percent2 = ((maxSlider.value - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
      activeTrack.style.left = percent1 + '%';
      activeTrack.style.width = (percent2 - percent1) + '%';
    }
    
    // Set up event listeners
    minSlider.addEventListener('input', updateSalaryOutput);
    maxSlider.addEventListener('input', updateSalaryOutput);
    
    // Initialize on page load
    updateSalaryOutput();


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

              const maxSalary = (job.max_salary*12)/100000;
              
              // Format timestamp
              const postedTime = timeAgo(job.created_at);
              
              // Build card content
              jobCard.innerHTML = `
                <div class="card-header">
                  <div class="company-logo">
                    <img src="/assessts/${job.company_name.toLowerCase()}.png" alt="${job.company_name}" 
                         onerror="this.onerror=null; this.src='https://placehold.co/600x400/png';">
                  </div>
                  <div class="time-posted">${postedTime}</div>
                </div>
                <div class="job-title">${job.job_title}</div>
                <div class="job-details">
                  <span class="job-type"><img id="exp" style="color:black;" src="assessts/exp.png"/> ${job.job_type.toUpperCase()}</span>
                  <span class="job-location"><img id="onsite" style="color:black;" src="assessts/jobtype.png"/>  ${job.location.toUpperCase()}</span>
                  <span class="job-salary"><img id="lpa" style="color:black;" src="assessts/salary.png"/> ${maxSalary} LPA</span>
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


      // search box

      document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("jobSearchInput");
      
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.trim().toLowerCase();
          const jobCards = document.querySelectorAll("#jobsContainer .job-card");
      
          jobCards.forEach(card => {
            const title = card.querySelector(".job-title").textContent.toLowerCase();
            
            // Show only if title STARTS WITH the query
            if (title.startsWith(query)) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        });
      });
      

      // Job location


document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("location");
      
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.trim().toLowerCase();
          const jobCards = document.querySelectorAll("#jobsContainer .job-card");
      
          jobCards.forEach(card => {
            const title = card.querySelector(".job-location").childNodes[1].nodeValue.trim().toLowerCase();
            
            // Show only if title STARTS WITH the query
            if (title.startsWith(query)) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        });
      });

      // job-type
      

      document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("jobType");
      
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.trim().toLowerCase();
          const jobCards = document.querySelectorAll("#jobsContainer .job-card");
      
          jobCards.forEach(card => {
            const title = card.querySelector(".job-type").childNodes[1].nodeValue.trim().toLowerCase();
            
            // Show only if title STARTS WITH the query
            if (title.startsWith(query)) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        });
      });

      // salary-range

      function filterBySalaryRange() {
  const minSalary = parseInt(document.getElementById("min-salary").value);
  const maxSalary = parseInt(document.getElementById("max-salary").value);

  const cards = document.querySelectorAll("#jobsContainer .job-card");


  cards.forEach(card => {
    const salaryText = card.querySelector(".job-salary").childNodes[1].nodeValue.trim();
    const salaryMatch = salaryText.match(/\d+/g); // Extract numbers from text

    if (salaryMatch) {
      const salary = parseFloat(salaryMatch[0]); // Assume single number or min value
       const monthlySalary = Math.floor((salary * 100000) / 12);

      if (monthlySalary >= minSalary && monthlySalary <= maxSalary) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    } else {
      card.style.display = "none"; // Hide if salary not found
    }
  });
}

document.getElementById("min-salary").addEventListener("input", filterBySalaryRange);
document.getElementById("max-salary").addEventListener("input", filterBySalaryRange);
