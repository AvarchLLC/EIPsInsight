# 🧠 Contributing to EIPsInsight

Thank you for your interest in contributing to EIPsInsight! This guide will help you understand how our development workflow is set up and how you can contribute effectively while avoiding common pitfalls like merge conflicts.


## 🏗️ Repository Structure & Deployment

### 🔹 `dev` Branch
- **Purpose:** All new features, bug fixes, and changes should be pushed to the `dev` branch.
- **Use Case:** This acts as our **preview/staging** environment where we test all updates before pushing them live.

### 🔸 `main` Branch
- **Purpose:** Production-ready, stable version of the project.
- **Deployment:** Hosted on our NGINX server (https://eipsinsight.com).
- **Use Case:** We only merge to `main` after thoroughly testing on `dev`.


## 🛠️ How to Contribute

### 1. Fork the Repository

Click the `Fork` button on the top right of this page to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/eipsinsight.git
cd eipsinsight
````

### 3. Add the Original Repository as Remote

```bash
git remote add upstream https://github.com/AvarchLLC/EIPsInsight.git
```

### 4. Create a Feature Branch

**Never** work directly on the `dev` or `main` branch in your fork.

```bash
git checkout -b feat/your-feature-name
```

### 5. Sync with Upstream `dev` Branch

Before you begin making changes, make sure your local fork is up to date:

```bash
git fetch upstream
git checkout dev
git merge upstream/dev
```

### 6. Rebase or Merge into Your Feature Branch

```bash
git checkout feat/your-feature-name
git merge dev
# or
git rebase dev
```

**🔧 If there are any merge conflicts, resolve them locally in your editor.**

### 7. Push to Your Fork

```bash
git push origin feat/your-feature-name
```

### 8. Create a Pull Request

* Go to your fork on GitHub
* Click "Compare & Pull Request"
* Make sure the base branch is `Avarch/dev` (NOT `main`)
* Provide a clear title and description


## ✅ What Happens After Your PR

* We’ll review your PR and test it on the `dev` Vercel deployment.
* Once it’s verified, **maintainers will handle merging into `main`** for production deployment via the NGINX server.



## 🧩 Tips to Avoid Merge Conflicts

* Regularly pull updates from the upstream `dev` branch.
* Never submit PRs from outdated forks — always sync and rebase.
* Keep your PRs small and focused — one feature or fix per PR.
* Don’t push to `dev` or `main` directly from your fork.

## 🙌 Thank You

Your contributions help us improve the EIPsInsight ecosystem and provide more value to the Ethereum community. We appreciate every PR — whether it's fixing a typo or adding a new feature!

Feel free to raise issues or ask questions if you get stuck.

