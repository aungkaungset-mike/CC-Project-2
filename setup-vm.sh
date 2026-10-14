#!/bin/bash
# ==============================================================================
# 🚀 1-COMMAND CLOUD VM DEPLOYMENT SCRIPT
# For: Cloud-Based Student Project Management System
# Targets: Ubuntu / Debian Linux on AWS EC2, Oracle Cloud VM, or any VPS
# ==============================================================================

set -e

echo "======================================================================"
echo "⚡ Starting Cloud VM Setup for Student Project Management System"
echo "======================================================================"

# 1. Update system packages
echo "📦 Step 1: Updating system packages..."
sudo apt-get update -y

# 2. Install Node.js 20 LTS and npm if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Step 2: Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# 3. Install project dependencies
echo "📦 Step 3: Installing project npm dependencies..."
npm install --production

# 4. Install PM2 (Production Process Manager) for auto-restart & background daemon
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Step 4: Installing PM2 Process Manager globally..."
    sudo npm install -g pm2
fi

# 5. Start / Restart application under PM2
echo "🚀 Step 5: Starting application with PM2..."
pm2 delete student-project-cloud 2>/dev/null || true
pm2 start server.js --name "student-project-cloud" -i max
pm2 save

# Setup PM2 to auto-start on VM reboot
echo "🔄 Step 6: Configuring system boot startup..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

# 7. Configure Firewall (UFW) to allow HTTP traffic
if command -v ufw &> /dev/null; then
    echo "🛡️ Step 7: Configuring UFW firewall for ports 80 and 3000..."
    sudo ufw allow 3000/tcp comment 'Student Project App' 2>/dev/null || true
    sudo ufw allow 80/tcp comment 'HTTP' 2>/dev/null || true
fi

# 8. Detect Public IP Address
PUBLIC_IP=$(curl -s https://ifconfig.me || curl -s https://api.ipify.org || echo "YOUR-SERVER-IP")

echo "======================================================================"
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "======================================================================"
echo "📡 Your web application is running and accessible at:"
echo "👉 http://${PUBLIC_IP}:3000"
echo ""
echo "🔍 Health Check:"
echo "👉 http://${PUBLIC_IP}:3000/api/health"
echo ""
echo "🛠️ PM2 Management Commands:"
echo "   pm2 status               # Check status"
echo "   pm2 logs                 # View live application logs"
echo "   pm2 restart all          # Restart server"
echo "======================================================================"
