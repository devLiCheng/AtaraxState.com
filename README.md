# AtaraxState.com 电商独立站 (Monorepo)

这是一个基于伊壁鸠鲁哲学 **Ataraxia（灵魂的宁静，不被打扰的状态）** 所设计的男士首饰独立站，包含面向消费者的极简美学独立站（前台）以及开箱即用的后台管理系统（后台）。

## 1. 项目架构

项目采用 Monorepo 结构进行组织：
- **/web**：前台独立站 + API 服务。基于 **Next.js (App Router)** 全栈框架搭建，利于 SEO 和 GEO。已配置 i18n（中英文双语）及 Less 编译支持。通过 Prisma ORM 连接 MySQL。
- **/admin**：后台管理系统。基于 **Vite + React + Ant Design** 搭建。保留 Ant Design 默认主题色，开箱即用，通过 API 代理与前台接口交互。
- **/scripts**：辅助脚手架脚本。例如 `create-component.js` 用于自动生成符合 `SKILL.MD` 规范的组件目录（包含 `components`, `utils`, `store`, `hooks`, `api`, `images`, `index.tsx`, `index.less` 等子文件夹和文件）。

---

## 2. 本地开发指南

### 前提条件
- 已安装 Node.js (v20+)
- 本地有正在运行的 MySQL（端口 `3306`，用户名 `root`，密码 `root`）

### 步骤 A：数据库初始化
1. 打开 `/web/.env` 确认数据库连接地址：
   `DATABASE_URL="mysql://root:root@127.0.0.1:3306/ataraxstate"`
2. 在 `/web` 目录下，同步数据库并生成 Prisma Client：
   ```bash
   cd web
   npx prisma db push
   ```
3. 运行种子脚本，注入初始数据（包括 4 个艺术首饰商品、2 篇宁静哲学博客、1 个默认管理员账号 `admin/admin`）：
   ```bash
   node prisma/seed.js
   ```

### 步骤 B：启动前台独立站
1. 在 `/web` 目录下安装依赖并启动：
   ```bash
   cd web
   npm install
   npm run dev
   ```
2. 浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问极简首饰商城。

### 步骤 C：启动后台管理系统
1. 在 `/admin` 目录下安装依赖并启动：
   ```bash
   cd admin
   npm install
   npm run dev
   ```
2. 浏览器打开 [http://localhost:3001](http://localhost:3001) 即可访问管理系统，使用账号 `admin`，密码 `admin` 登录。
3. 后台支持商品的增删改查、博客文章的增删改查以及订单的发货和状态标记。

---

## 3. 组件开发规范 (SKILL.MD)

创建任何前/后台组件时，**必须**遵循以下结构。您可以使用根目录下的快捷脚本自动生成：
```bash
# 示例：创建前台的 Header 组件
node scripts/create-component.js web/src/components/Header
```
这将自动在指定位置创建以下结构，即使文件夹是空的也一应俱全：
```text
Header/
  ├── components/   # 子组件
  ├── utils/        # 工具方法
  ├── store/        # 状态管理
  ├── hooks/        # 自定义 Hooks
  ├── api/          # 接口请求
  ├── images/       # 组件图片
  ├── index.tsx     # 组件主入口
  └── index.less    # 样式文件 (已被 /web/src/app/globals.less 全局引入)
```

---

## 4. Git 提交与 GitHub 关联

本地 Git 仓库已初始化并进行了首次 Commit。
若要将代码推送到您新创建的与域名同名的 GitHub 仓库（例如 `AtaraxState.com` 或 `ataraxstate`），请在项目根目录下执行以下命令：

```bash
# 1. 关联您的 GitHub 远程仓库
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/AtaraxState.com.git

# 2. 重命名分支并推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 5. Coolify 容器化部署

项目根目录下已准备好 `docker-compose.yaml` 文件以及各个服务的 `Dockerfile`，用于一键在 **Coolify** 中打包部署。

### 部署服务列表：
1. **db** (MySQL 8.0 服务)：持久化保存商品、博客及订单数据。
2. **web** (Next.js 服务)：对外提供前台商城服务，运行于容器内 `3000` 端口。
3. **admin** (Nginx + Vite 静态服务)：提供管理系统页面，运行于容器内 `80` 端口，通过 `docker-compose.yaml` 映射到宿主机 `3001` 端口。

在 Coolify 中，直接选择 **Docker Compose** 部署，指定您的 GitHub 仓库及该 `docker-compose.yaml` 即可完成一键上线。
