document.addEventListener('DOMContentLoaded', function() {
    // Check if run simulation button exists on the page
    const runSimulationBtn = document.getElementById('run-simulation-btn');
    if (runSimulationBtn) {
        runSimulationBtn.addEventListener('click', runSimulation);
    }
    
    // Set active navigation link based on current page
    setActiveNavLink();
});

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function runSimulation() {
    // Show loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    // Update run button status
    const runBtn = document.getElementById('run-simulation-btn');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = 'Processing...';
    }
    
    // Create a progress animation
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        progressBar.classList.remove('progress-complete');
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 90) {
                progress = 90; // Cap at 90% until server confirms completion
                clearInterval(progressInterval);
            }
            updateProgress(Math.min(Math.floor(progress), 90));
        }, 300);
    }
    
    // Make AJAX request to run the simulation
    fetch('/run_simulation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Complete the progress bar
            setTimeout(() => {
                updateProgress(100);
            }, 500);
            
            showAlert('success', 'Simulation completed successfully!');
            
            // If we're on the results page, update the content
            if (window.location.pathname === '/results') {
                setTimeout(() => {
                    updateResultsPage();
                }, 800);
            } else {
                // Redirect to results page after a short delay
                setTimeout(() => {
                    window.location.href = '/results';
                }, 1500);
            }
        } else {
            showAlert('danger', `Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('danger', 'An error occurred while running the simulation.');
    })
    .finally(() => {
        // Hide loading overlay after a short delay
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            // Reset run button
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.textContent = 'Run Simulation';
            }
        }, 1000);
    });
}

function updateResultsPage() {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    // Load the images with their respective roles
    const mapImage = document.getElementById('map-image');
    const spectrumImage = document.getElementById('spectrum-image');
    
    if (spectrumImage) {
        // Kaolinite Reflectance vs Wavelength
        spectrumImage.src = `/static/spectrum_result.png?t=${timestamp}`;
        console.log("Setting spectrum image source to:", spectrumImage.src);
        fadeInImage(spectrumImage);
    }
    
    if (mapImage) {
        // Kaolinite Probability Map
        mapImage.src = `/static/map_result.png?t=${timestamp}`;
        console.log("Setting map image source to:", mapImage.src);
        fadeInImage(mapImage);
    }
}

function fadeInImage(imgElement) {
    // Only apply if the image is not already visible
    if (imgElement.style.opacity !== '1') {
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.style.opacity = '1';
        }, 300);
    }
}

function checkSimulationStatus() {
    fetch('/get_progress')
        .then(response => response.json())
        .then(data => {
            updateProgress(data.progress);
            
            // If a simulation has been completed, update the results display
            if (data.progress === 100) {
                const mapImage = document.getElementById('map-image');
                const spectrumImage = document.getElementById('spectrum-image');
                
                if (mapImage && mapImage.getAttribute('src') === '#') {
                    // Kaolinite Probability Map
                    mapImage.src = '/static/map_result.png';
                    console.log("Setting map image source to:", mapImage.src);
                }
                
                if (spectrumImage && spectrumImage.getAttribute('src') === '#') {
                    // Kaolinite Reflectance vs Wavelength
                    spectrumImage.src = '/static/spectrum_result.png';
                    console.log("Setting spectrum image source to:", spectrumImage.src);
                }
            }
        })
        .catch(error => {
            console.error('Error checking simulation status:', error);
        });
}

function updateProgress(progress) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${progress}%`;
        
        if (progress === 100) {
            progressBar.classList.add('progress-complete');
        } else {
            progressBar.classList.remove('progress-complete');
        }
    }
}

function showAlert(type, message) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Find alert container
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        // Clear any existing alerts
        alertContainer.innerHTML = '';
        
        // Add the new alert
        alertContainer.appendChild(alertDiv);
        
        // Auto-remove the alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
} 