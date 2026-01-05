# Deployment Guide: Meow Meow Pet Shop to Hostinger VPS

This guide will help you deploy your full-stack application to an Ubuntu 22.04 LTS VPS.

## Prerequisites on VPS

1. **Update System**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js (v20)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Process Manager (PM2)**:
   ```bash
   sudo npm install -g pm2
   ```

4. **Install Nginx**:
   ```bash
   sudo apt install nginx -y
   ```

## Step 1: Prepare the Code

1. **Clone the repository** (or upload your files):
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Frontend**:
   ```bash
   npm run build
   ```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:
```bash
nano .env
```
Add your production variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
# If using Firebase/Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Step 3: Start the Server with PM2

```bash
pm2 start dist/index.cjs --name "meow-shop"
pm2 save
pm2 startup
```

## Step 4: Configure Nginx (Reverse Proxy)

1. Create a config file:
   ```bash
   sudo nano /etc/nginx/sites-available/meow-shop
   ```

2. Paste this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com; # Replace with your domain

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Increase client body size for image uploads
       client_max_body_size 10M;
   }
   ```

3. Enable the config:
   ```bash
   sudo ln -s /etc/nginx/sites-available/meow-shop /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Step 5: SSL (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Common Commands
- **View Logs**: `pm2 logs meow-shop`
- **Restart**: `pm2 restart meow-shop`
- **Status**: `pm2 status`
