# ☁️ Free Cloud Deployment Guide (No Credit Card Required)

This guide provides **4 zero-cost ways** to deploy your **Cloud-Based Student Project Management System** for your university course evaluation.

---

## 🌟 Option 1: Render.com Web Service (Recommended — 100% Free, No Credit Card)

Render lets you host Node.js web applications for free without ever asking for a credit card.

### Step-by-Step Instructions:

1. **Push your project to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Student Project Management System"
   # Create a new repository on github.com, then:
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Sign up on Render**:
   - Go to [https://render.com](https://render.com)
   - Click **Get Started for Free** and choose **Sign in with GitHub** (No credit card needed).

3. **Create New Web Service**:
   - Click the **New +** button &rarr; select **Web Service**.
   - Connect your GitHub repository.
   - Configure the following settings:
     - **Name**: `student-project-management` (or your choice)
     - **Region**: Closest to you (e.g. Frankfurt, Oregon, Singapore)
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free` ($0/month)
   - Click **Create Web Service**.

4. **Your Live URL**:
   - In 1–2 minutes, Render will build and deploy your app.
   - You will receive a live public HTTPS link: `https://student-project-management-xxxx.onrender.com`.

---

## ⚡ Option 2: Instant Public Cloud Tunnel (Zero Setup, Free HTTPS)

If you are demonstrating your project live to your professor or need an instant public link right from your laptop or lab computer without any sign-up:

1. **Start the local server & cloud tunnel**:
   ```bash
   npm run tunnel
   ```
   *or:*
   ```bash
   ./start-tunnel.sh
   ```

2. **What this does**:
   - Exposes your local server to a secure global edge network via Cloudflare Tunnel.
   - Generates a live public HTTPS URL: `https://xxxx.trycloudflare.com`.
   - Any team member, professor, or evaluator can open this link on their laptop or mobile phone to interact with your live system.

---

## 💻 Option 3: GitHub Codespaces (Free Cloud Ubuntu VM, No Credit Card)

Every GitHub user receives **60 hours of free cloud VM compute per month** with no credit card required.

1. Push this project to your GitHub repository.
2. Click the green **Code** button on GitHub &rarr; select the **Codespaces** tab &rarr; click **Create codespace on main**.
3. In the browser-based cloud Ubuntu VM terminal, run:
   ```bash
   npm install
   npm start
   ```
4. Click the **Ports** tab in Codespaces:
   - Right-click port **3000** &rarr; change **Port Visibility** to **Public**.
   - Click the globe icon / Local Address to open your live cloud URL.

---

## 🖥️ Option 4: AWS EC2 Ubuntu VM / AWS Academy Sandbox

If your university provides an **AWS Academy** account ($100 free credit, no personal card) or you have an AWS Free Tier account:

### 1. Launch EC2 Instance:
- **AMI**: Ubuntu Server 24.04 LTS (HVM)
- **Instance Type**: `t2.micro` or `t3.micro` (Free tier eligible)
- **Key Pair**: Create and download your `.pem` key (e.g., `cc-key.pem`)
- **Security Group (Inbound Rules)**:
  - SSH: Port `22` (Source: My IP or `0.0.0.0/0`)
  - Custom TCP: Port `3000` (Source: `0.0.0.0/0`)
  - HTTP: Port `80` (Source: `0.0.0.0/0`)

### 2. Connect via SSH:
```bash
chmod 400 cc-key.pem
ssh -i "cc-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

### 3. Deploy in 1 Command:
Upload this project folder to your EC2 instance (or `git clone` your repo), then run:
```bash
chmod +x setup-vm.sh
./setup-vm.sh
```

### 4. Result:
- Node.js 20 LTS is installed.
- PM2 process manager starts the app as a background daemon with auto-recovery on reboot.
- Access your live system at:
  ```
  http://<YOUR-EC2-PUBLIC-IP>:3000
  ```
- Check server health & VM metrics:
  ```
  http://<YOUR-EC2-PUBLIC-IP>:3000/api/health
  ```

---

## 🐳 Option 5: Docker Container Deployment (Any Cloud VM)

If your VM has Docker installed, you can launch the system with a single command:

```bash
docker compose up -d --build
```

View logs:
```bash
docker compose logs -f
```

Stop container:
```bash
docker compose down
```

---

## 📊 Summary of Free Deployment Options

| Method | Free? | Credit Card Needed? | Setup Time | Best For |
|---|---|---|---|---|
| **Render.com** | Yes | ❌ NO | 3 minutes | Permanent 24/7 web URL |
| **Cloudflare Tunnel** | Yes | ❌ NO | 10 seconds | Quick live demo for professors |
| **GitHub Codespaces** | Yes (60 hrs/mo) | ❌ NO | 1 minute | Browser-based cloud VM |
| **AWS Academy / EC2** | Yes (via Uni) | ❌ NO (Academy) | 5 minutes | University Cloud Computing viva |
