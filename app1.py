from flask import Flask, render_template, jsonify, request
import os
import time
import matplotlib.pyplot as plt
import numpy as np

from Raster import Raster
from Spectrum import Spectrum
from utils import preprocess, spectralMatch
from setup_images import setup_images

app = Flask(__name__)

# Simulated progress tracking
simulation_progress = 0
simulation_complete = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dataset')
def dataset():
    return render_template('dataset.html')

@app.route('/preprocessing')
def preprocessing_page():
    return render_template('preprocessing.html')

@app.route('/spectral_analysis')
def spectral_analysis():
    return render_template('spectral_analysis.html')

@app.route('/classification')
def classification():
    return render_template('classification.html')

@app.route('/visualization')
def visualization():
    return render_template('visualization.html')

@app.route('/results')
def results():
    # Start with empty results - they'll be populated when simulation runs
    return render_template('results.html')

@app.route('/run_simulation', methods=['POST'])
def run_simulation():
    global simulation_progress, simulation_complete
    
    try:
        # Reset progress
        simulation_progress = 0
        simulation_complete = False
        
        # For demo purposes, we'll use pre-calculated results
        # This is a simplified version of the actual analysis
        
        # In a real scenario, you would run the actual analysis:
        # 1. Load data
        # 2. Preprocess
        # 3. Run spectral matching
        # 4. Generate visualizations
        
        # Instead, we'll just copy our pre-generated images
        setup_images()
        
        # Simulate processing time with progress updates
        for i in range(10):
            simulation_progress += 10
            time.sleep(0.5)  # Simulate work
        
        simulation_complete = True
        simulation_progress = 100
        
        return jsonify({"success": True, "message": "Simulation completed successfully"})
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/get_progress')
def get_progress():
    global simulation_progress, simulation_complete
    return jsonify({"progress": simulation_progress, "complete": simulation_complete})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 