import psutil
import subprocess
import requests
import os
import platform

# Slack webhook URL
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')
SLACK_CHANNEL = '#server-monitoring-system'  # Specify your channel name here

# Thresholds
DISK_THRESHOLD = 85  # Disk space threshold percentage
CPU_THRESHOLD = 90   # CPU usage threshold percentage
MYSQL_SERVICE_NAME = "mysql"  # MySQL service name depending on the Linux distribution
HTTP_SERVICE_NAME = "apache2"  # Replace with "nginx" if you're using Nginx

def send_slack_alert(message):
    """Send an alert to Slack."""
    if not SLACK_WEBHOOK_URL:
        print("SLACK_WEBHOOK_URL is not configured; skipping Slack alert.")
        return

    payload = {
        "channel": SLACK_CHANNEL,  # Specify the channel here
        "text": message
    }
    requests.post(SLACK_WEBHOOK_URL, json=payload)

def check_disk_space():
    """Check disk usage."""
    disk_usage = psutil.disk_usage('/')
    if disk_usage.percent > DISK_THRESHOLD:
        send_slack_alert(f"Alert! Disk space usage is at {disk_usage.percent}%. Please check.")
        return False
    return True

def check_cpu_usage():
    """Check CPU usage."""
    cpu_usage = psutil.cpu_percent(interval=1)
    if cpu_usage > CPU_THRESHOLD:
        # Restart services on high CPU usage
        send_slack_alert(f"Alert! CPU usage is at {cpu_usage}%. Restarting HTTP and MySQL services.")
        restart_services()
        return False
    return True

def check_mysql_service():
    """Check MySQL service status, restart if down."""
    if platform.system() == "Linux":
        try:
            output = subprocess.check_output(["systemctl", "is-active", MYSQL_SERVICE_NAME])
            if output.strip().decode() != "active":
                send_slack_alert(f"Alert! MySQL service is not running. Attempting to start it.")
                start_mysql_service()
                return False
        except subprocess.CalledProcessError:
            send_slack_alert(f"Alert! MySQL service is not running (systemctl command failed). Attempting to start it.")
            start_mysql_service()
            return False
    return True

def check_http_service():
    """Check HTTP service status and restart if down."""
    if platform.system() == "Linux":
        try:
            output = subprocess.check_output(["systemctl", "is-active", HTTP_SERVICE_NAME])
            if output.strip().decode() != "active":
                send_slack_alert(f"Alert! {HTTP_SERVICE_NAME} service is not running. Attempting to start it.")
                start_http_service()
                return False
        except subprocess.CalledProcessError:
            send_slack_alert(f"Alert! {HTTP_SERVICE_NAME} service is not running (systemctl command failed). Attempting to start it.")
            start_http_service()
            return False
    return True

def check_server_status():
    """Check server status by pinging localhost."""
    response = os.system("ping -c 1 127.0.0.1 > /dev/null 2>&1")
    if response != 0:
        send_slack_alert(f"Alert! Server is down (ping failed). Please check.")
        return False
    return True

def start_mysql_service():
    """Start the MySQL service."""
    try:
        subprocess.call(["sudo", "systemctl", "start", MYSQL_SERVICE_NAME])
        send_slack_alert(f"MySQL service started successfully.")
    except Exception as e:
        send_slack_alert(f"Failed to start MySQL service. Error: {str(e)}")

def start_http_service():
    """Start the HTTP service (Apache or Nginx)."""
    try:
        subprocess.call(["sudo", "systemctl", "start", HTTP_SERVICE_NAME])
        send_slack_alert(f"{HTTP_SERVICE_NAME} service started successfully.")
    except Exception as e:
        send_slack_alert(f"Failed to start {HTTP_SERVICE_NAME} service. Error: {str(e)}")

def restart_services():
    """Restart MySQL and HTTP services."""
    try:
        subprocess.call(["sudo", "systemctl", "restart", MYSQL_SERVICE_NAME])
        send_slack_alert(f"MySQL service restarted due to high CPU usage.")
    except Exception as e:
        send_slack_alert(f"Failed to restart MySQL service. Error: {str(e)}")

    try:
        subprocess.call(["sudo", "systemctl", "restart", HTTP_SERVICE_NAME])
        send_slack_alert(f"{HTTP_SERVICE_NAME} service restarted due to high CPU usage.")
    except Exception as e:
        send_slack_alert(f"Failed to restart {HTTP_SERVICE_NAME} service. Error: {str(e)}")

def main():
    # Initialize a list to track the status of checks
    checks = [
        check_disk_space(),
        check_cpu_usage(),
        check_mysql_service(),
        check_http_service(),
        check_server_status()
    ]

    # If all checks return True
    if all(checks):
        send_slack_alert("Everything is working fine, guys! Please ignore this and focus on your work :wink:")

if __name__ == "__main__":
    main()
