# Deployment Guide for Ubuntu 22.04 LTS VPS (Hostinger)

This guide will help you deploy your application on a standard VPS.

## 1. Prepare Your VPS
Connect to your VPS via SSH and install required software:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

## 2. Deploy Code
1. Upload your project files to the VPS (excluding `node_modules`).
2. Install dependencies on the VPS:
```bash
npm install
```
3. Build the application:
```bash
npm run build
```

## 3. Configure Environment
Create a `.env` file on your VPS with your production values:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=a_strong_random_secret
NODE_ENV=production
# Add other VITE_ variables here
```

## 4. Start the Application
Use PM2 to run your app in the background:
```bash
pm2 start dist/index.js --name "pet-shop"
pm2 save
pm2 startup
```

## 5. Reverse Proxy (Nginx)
Install Nginx to handle web traffic:
```bash
sudo apt install nginx -y
```
Create a configuration file `/etc/nginx/sites-available/petshop`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/petshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```