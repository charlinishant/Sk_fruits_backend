import os
import time
from datetime import datetime, timedelta

# Define the backup directory
backup_dir = '/var/www/html/backups/'

# Get the current time
now = time.time()

# Define the time limit for keeping backups (2 days in seconds)
time_limit = 2 * 24 * 60 * 60  # 2 days

# Iterate through the files in the backup directory
for filename in os.listdir(backup_dir):
    # Check if the file is an .sql file
    if filename.endswith('.sql'):
        file_path = os.path.join(backup_dir, filename)

        # Get the last modified time of the file
        file_mod_time = os.path.getmtime(file_path)

        # Check if the file is older than the specified time limit
        if now - file_mod_time > time_limit:
            try:
                # Remove the old backup file
                os.remove(file_path)
                print(f"Removed old backup file: {filename}")
            except Exception as e:
                print(f"Error removing file {filename}: {e}")

print("Backup cleanup completed.")