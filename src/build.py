import os
import shutil

def move_build():
    # Source and destination directories
    src_dir = 'src'
    dist_dir = 'dist'

    # Iterate through the source directory
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            # Check if the file has a .ts extension
            if file.endswith('.ts'):
                continue  # Skip .ts files
            # Get the full path of the source file
            src_file = os.path.join(root, file)
            # Calculate the corresponding destination path
            dest_file = os.path.join(dist_dir, os.path.relpath(src_file, src_dir))
            
            # Create the destination directory if it doesn't exist
            os.makedirs(os.path.dirname(dest_file), exist_ok=True)
            
            # Copy the file to the destination directory
            shutil.copy2(src_file, dest_file)

    print("Files copied successfully.")
    
move_build()
