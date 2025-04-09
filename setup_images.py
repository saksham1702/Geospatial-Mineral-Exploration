import shutil
import os

def copy_file(src, dest):
    """Copy a file and print the result."""
    try:
        shutil.copy2(src, dest)
        print(f"Successfully copied {src} to {dest}")
        return True
    except Exception as e:
        print(f"Error copying {src} to {dest}: {e}")
        return False

def setup_images():
    """Copy images directly to static folder with proper names."""
    # Create a list of source and destination pairs
    copy_tasks = [
        # First image - spectrum graph (Kaolinite Reflectance vs Wavelength)
        ("/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/images/Reflectance_map.png", 
         "/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/spectrum_result.png"),
        
        # Second image - probability map
        ("/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/images/Probability_map.png", 
         "/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/map_result.png"),
        
        # Also copy to true_color and kaolinite_probability for consistency
        ("/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/images/Reflectance_map.png", 
         "/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/true_color.png"),
        
        ("/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/images/Probability_map.png", 
         "/Users/pookie/Desktop/Geospatial_AI/Remote-Sensing-for-Mineral-Exploration-Demo/static/kaolinite_probability.png")
    ]
    
    print("Starting to copy image files...")
    
    # Process each copy task
    for src, dest in copy_tasks:
        print(f"Checking source file: {src}")
        if os.path.exists(src):
            copy_file(src, dest)
        else:
            print(f"Warning: Source file not found: {src}")
    
    print("Image setup complete!")

if __name__ == "__main__":
    setup_images() 