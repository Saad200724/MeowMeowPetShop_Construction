# Final Steps for Hostinger VPS Deployment

Follow these commands exactly in your VPS terminal.

## Step 1: Install Node.js 20 & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## Step 2: Upload and Install
1. Upload your files (except `node_modules`).
2. Run these commands:
```bash
npm install
npm run build
```

## Step 3: Setup Environment
Create a file named `.env`:
```bash
nano .env
```
Paste this and save (Ctrl+O, Enter, Ctrl+X):
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=some_random_secret
NODE_ENV=production
VITE_FIREBASE_API_KEY=AIzaSyBlWX-gUNEoGj-pnO1i97SGBivHJ7S8TnY
VITE_FIREBASE_MESSAGING_SENDER_ID=582206454102
VITE_FIREBASE_STORAGE_BUCKET=meow-shop-bd.firebasestorage.app
VITE_FIREBASE_PROJECT_ID=meow-shop-bd
VITE_FIREBASE_MEASUREMENT_ID=G-6150EGXM5S
VITE_FIREBASE_AUTH_DOMAIN=meow-shop-bd.firebaseapp.com
VITE_FIREBASE_APP_ID=1:582206454102:web:012879773aea1fad563ef7
```

## Step 4: Start App
```bash
pm2 start dist/index.js --name "pet-shop"
pm2 save
pm2 startup
```

## Step 5: Nginx Proxy
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default
```
Replace the content with:
```nginx
server {
    listen 80;
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
Then restart Nginx:
```bash
sudo systemctl restart nginx
```