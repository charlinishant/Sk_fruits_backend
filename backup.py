import os
import subprocess
import requests
from datetime import datetime

# MySQL Configuration
MYSQL_USER = 'skfruit'  # Your MySQL username
MYSQL_PASSWORD = 'skfruit@24'  # Your MySQL password
MYSQL_DB = 'skfruit'  # Your MySQL database name
BACKUP_URL_DIRECTORY = '/var/www/html/backups/'  # Web server directory to serve backups
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')
SLACK_CHANNEL = '#database'  # Slack channel to send notifications

# Ensure the backup directory exists
os.makedirs(BACKUP_URL_DIRECTORY, exist_ok=True)

def create_backup():
    """Creates a backup of the specified MySQL database directly in the web server directory."""
    try:
        # Prepare the backup file name
        backup_file_name = f"{MYSQL_DB}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
        backup_file_path = os.path.join(BACKUP_URL_DIRECTORY, backup_file_name)

        # Command to create the MySQL backup
        backup_command = [
            'mysqldump',
            '-u', MYSQL_USER,
            f'-p{MYSQL_PASSWORD}',  # No space after -p
            MYSQL_DB
        ]

        print(f"Running backup command: {' '.join(backup_command)}")  # Debugging line

        # Execute the backup command and write to the backup file
        with open(backup_file_path, 'w') as backup_output:
            subprocess.run(backup_command, stdout=backup_output, stderr=subprocess.PIPE, check=True)

        print(f"Backup created successfully: {backup_file_path}")
        return backup_file_name
    except subprocess.CalledProcessError as e:
        print(f"Error creating backup: {e.stderr.decode()}")  # Print error detail
        return None

def send_backup_url_to_slack(file_name):
    """Sends the backup URL to the specified Slack channel using a webhook."""
    if not SLACK_WEBHOOK_URL:
        print("SLACK_WEBHOOK_URL is not configured; skipping Slack notification.")
        return

    backup_url = f'http://103.174.102.89/backups/{file_name}'  # Update with your server IP

    # Prepare the payload
    payload = {
        "channel": SLACK_CHANNEL,
        "text": f"New MySQL backup created: {backup_url}"
    }

    # Send the request to the Slack webhook
    response = requests.post(SLACK_WEBHOOK_URL, json=payload)

    if response.status_code == 200:
        print("Backup URL sent to Slack successfully.")
    else:
        print(f"Failed to send backup URL to Slack: {response.status_code} {response.text}")

def main():
    backup_file_name = create_backup()
    if backup_file_name:
        send_backup_url_to_slack(backup_file_name)

if __name__ == '__main__':
    main()
