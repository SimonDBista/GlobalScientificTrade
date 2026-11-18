#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Deploying Global Scientific Trade to Contabo VPS        "
echo "  Target Port: 5000 (Nginx) -> 5001 (Node.js)             "
echo "=========================================================="

APP_DIR="/var/www/global-scientific-trade"
cd "$APP_DIR"

echo ">> 1. Pulling latest code from GitHub..."
git pull origin main

echo ">> 2. Installing root server dependencies..."
npm install

echo ">> 3. Installing client dependencies & building production SPA..."
cd client
npm install
npm run build
cd "$APP_DIR"

echo ">> 4. Setting filesystem permissions..."
mkdir -p uploads/products uploads/categories logs
chmod -R 775 uploads database public logs || true

echo ">> 5. Setting up production environment (.env)..."
cat << 'EOF' > .env
PORT=5001
NODE_ENV=production
JWT_SECRET=gst_prod_secret_key_2026_secured
EOF

echo ">> 6. Configuring PM2 ecosystem..."
cat << 'EOF' > ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "global-scientific-trade",
      script: "server/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5001
      },
      watch: false,
      max_memory_restart: "400M"
    }
  ]
};
EOF

echo ">> 7. Starting / Reloading PM2 process..."
if pm2 describe global-scientific-trade > /dev/null 2>&1; then
    echo ">> Reloading existing PM2 process..."
    pm2 reload ecosystem.config.cjs --only global-scientific-trade
else
    echo ">> Starting new PM2 process..."
    pm2 start ecosystem.config.cjs --only global-scientific-trade
fi
pm2 save || true

echo ">> 8. Configuring Nginx Virtual Host on Port 5000..."
cat << 'EOF' > /etc/nginx/sites-available/globalscientifictrade
server {
    listen 5000;
    listen [::]:5000;
    server_name 169.58.213.137;

    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/globalscientifictrade /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo ">> 9. Updating UFW Firewall rules..."
ufw allow 5000/tcp || true

echo "=========================================================="
echo "  Global Scientific Trade is LIVE on Port 5000!           "
echo "  URL: http://169.58.213.137:5000                         "
echo "=========================================================="
