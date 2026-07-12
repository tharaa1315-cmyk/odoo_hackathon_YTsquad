<div align="center">

<img src="https://img.icons8.com/fluency/96/000000/workflow.png" width="90" alt="SyncFlow logo"/>

# SyncFlow

### Enterprise Asset & Resource Management Platform

**Track. Allocate. Maintain. Audit. All in one place.**

<br/>

[![MERN](https://img.shields.io/badge/MERN-Full%20Stack-4CAF50?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-Express-3C873A?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-00684A?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-Authentication-F7941E?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](#)
[![Hackathon](https://img.shields.io/badge/Odoo-Hackathon%202026-8B5CF6?style=for-the-badge)](#)

<br/>

[![Stars](https://img.shields.io/github/stars/USERNAME/SyncFlow?style=social)](https://github.com/tharaa1315-cmyk/odoo_hackathon_YTsquad)
[![Forks](https://img.shields.io/github/forks/USERNAME/SyncFlow?style=social)](#)
[![License](https://img.shields.io/badge/license-MIT-informational)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

</div>

<br/>

<div align="center">

### `📖` [Overview](#-overview) &nbsp;•&nbsp; `✨` [Features](#-key-features) &nbsp;•&nbsp; `🧩` [Modules](#-modules) &nbsp;•&nbsp; `🖥` [Tech Stack](#-tech-stack) &nbsp;•&nbsp; `🚀` [Installation](#-installation) &nbsp;•&nbsp; `👥` [Team](#-team)

</div>

<br/>

---

## 📖 Overview

> SyncFlow is a modern **Enterprise Asset & Resource Management System** built for the **Odoo Hackathon 2026** — replacing spreadsheets and paper logs with a secure, scalable, role-based ERP platform.

<table>
<tr>
<td width="50%" valign="top">

**The problem**
Organizations juggle assets, bookings, and maintenance across disconnected spreadsheets — leading to lost equipment, double bookings, and zero audit trail.

</td>
<td width="50%" valign="top">

**The solution**
One centralized platform for asset registration, allocation, resource booking, maintenance workflows, audits, and analytics — with role-based access built in.

</td>
</tr>
</table>

<br/>

## ✨ Key Features

<table>
<tr>
<td align="center" width="25%">

### 🔐
**JWT Auth**
Secure login, registration & session management

</td>
<td align="center" width="25%">

### 🧑‍🤝‍🧑
**RBAC**
Fine-grained, role-based authorization

</td>
<td align="center" width="25%">

### 📦
**Asset Lifecycle**
Full tracking from registration to retirement

</td>
<td align="center" width="25%">

### 📊
**Live Analytics**
Dashboards & KPI reporting out of the box

</td>
</tr>
</table>

<br/>

### 👥 Role-Based Access

<div align="center">

| Role | Icon | Access Scope |
|:--|:--:|:--|
| **Admin** | 👑 | Complete organization management — full control |
| **Asset Manager** | 🛠 | Assets, allocation & maintenance oversight |
| **Department Head** | 🏢 | Department assets & approval workflows |
| **Employee** | 👨‍💼 | Personal assets & request submission |

</div>

<br/>

## 📦 Asset Lifecycle

```mermaid
flowchart LR
    A([📝 Register Asset]) --> B[🟢 Available]
    B --> C[📤 Allocated]
    C --> D[🔧 Maintenance]
    D --> E[↩️ Returned]
    E --> B

    style A fill:#8B5CF6,stroke:#5B21B6,color:#fff
    style B fill:#22C55E,stroke:#15803D,color:#fff
    style C fill:#3B82F6,stroke:#1D4ED8,color:#fff
    style D fill:#F97316,stroke:#C2410C,color:#fff
    style E fill:#06B6D4,stroke:#0E7490,color:#fff
```

<br/>

## 🔄 Complete Workflow

```mermaid
flowchart TD
    L([🔑 Login]) --> AUTH[🔐 Authentication]
    AUTH --> ROLE{🎭 Role Verification}

    ROLE -->|Admin| ADM[👑 Admin]
    ROLE -->|Asset Manager| AM[🛠 Asset Manager]
    ROLE -->|Dept Head| DH[🏢 Department Head]
    ROLE -->|Employee| EMP[👨‍💼 Employee]

    ADM --> ADM1[Organization Management]
    ADM --> ADM2[Reports & Audits]

    AM --> AM1[Assets & Booking]
    AM --> AM2[Transfer & Returns]

    DH --> DH1[Department Assets]
    DH --> DH2[Approval Queue]

    EMP --> EMP1[My Assets & Requests]
    EMP --> EMP2[Maintenance & Notifications]

    style L fill:#8B5CF6,stroke:#5B21B6,color:#fff
    style AUTH fill:#6366F1,stroke:#4338CA,color:#fff
    style ROLE fill:#EC4899,stroke:#BE185D,color:#fff
    style ADM fill:#F59E0B,stroke:#B45309,color:#fff
    style AM fill:#10B981,stroke:#047857,color:#fff
    style DH fill:#3B82F6,stroke:#1D4ED8,color:#fff
    style EMP fill:#EF4444,stroke:#B91C1C,color:#fff
```

<br/>

## 🧩 Modules

<table>
<tr>
<td width="50%" valign="top">

### 🏢 Organization Setup
- Department configuration
- Asset categories
- Employee directory
- Role promotion

</td>
<td width="50%" valign="top">

### 💻 Asset Management
- Asset registration
- Allocation & transfer
- Return handling
- QR code generation
- Full asset history

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📅 Resource Booking
- Meeting rooms & conference halls
- Vehicle & equipment booking
- Calendar view
- Automatic conflict detection

</td>
<td width="50%" valign="top">

### 📊 Reports & Analytics
- Asset utilization
- Department & maintenance reports
- Resource usage insights
- Audit trail & dashboard KPIs

</td>
</tr>
</table>

<br/>

### 🔧 Maintenance Pipeline

```mermaid
flowchart LR
    R([📩 Request]) --> P[⏳ Pending]
    P --> AP[✅ Approved]
    AP --> T[👷 Technician Assigned]
    T --> IP[🔄 In Progress]
    IP --> DONE([🎉 Resolved])

    style R fill:#94A3B8,stroke:#475569,color:#fff
    style P fill:#F59E0B,stroke:#B45309,color:#fff
    style AP fill:#3B82F6,stroke:#1D4ED8,color:#fff
    style T fill:#8B5CF6,stroke:#5B21B6,color:#fff
    style IP fill:#EC4899,stroke:#BE185D,color:#fff
    style DONE fill:#22C55E,stroke:#15803D,color:#fff
```

<br/>

## 🖥 Tech Stack

<div align="center">

| Layer | Technology | Badge |
|:--|:--|:--|
| **Frontend** | React 19 + TypeScript + Vite | ![React](https://img.shields.io/badge/-React%2019-149ECA?logo=react&logoColor=white) |
| **Backend** | Node.js + Express.js | ![Node](https://img.shields.io/badge/-Node.js-3C873A?logo=node.js&logoColor=white) |
| **Database** | MongoDB | ![Mongo](https://img.shields.io/badge/-MongoDB-00684A?logo=mongodb&logoColor=white) |
| **Auth** | JWT | ![JWT](https://img.shields.io/badge/-JWT-F7941E?logo=jsonwebtokens&logoColor=white) |
| **Styling** | Tailwind CSS | ![Tailwind](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) |
| **Storage** | Cloudinary | ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white) |
| **API** | REST | ![REST](https://img.shields.io/badge/-REST%20API-6E4AFF) |

</div>

<br/>

## 📂 Project Structure

```text
SyncFlow
│
├── 🎨 frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── layouts
│   └── services
│
├── ⚙️  backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── 📄 README.md
```

<br/>

## 🚀 Installation

<details open>
<summary><b>1️⃣ Clone the repository</b></summary>

```bash
git clone https://github.com/USERNAME/SyncFlow.git
```

</details>

<details open>
<summary><b>2️⃣ Backend setup</b></summary>

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

> Runs at **http://localhost:5000**

</details>

<details open>
<summary><b>3️⃣ Frontend setup</b></summary>

```bash
cd frontend
npm install
npm run dev
```

> Runs at **http://localhost:5173**

</details>

<br/>

### 🔑 Demo Account

<div align="center">

| Field | Value |
|:--|:--|
| 📧 Email | `admin@syncflow.app` |
| 🔒 Password | `Admin@123` |

*Available immediately after running the seed script.*

</div>

<br/>

## 🌟 Highlights

<div align="center">

✅ Enterprise ERP Architecture&nbsp;&nbsp;&nbsp;✅ Role-Based Access Control&nbsp;&nbsp;&nbsp;✅ JWT Authentication
✅ QR Code Asset Tracking&nbsp;&nbsp;&nbsp;✅ Maintenance Workflow&nbsp;&nbsp;&nbsp;✅ Resource Booking
✅ Audit Management&nbsp;&nbsp;&nbsp;✅ Dashboard Analytics&nbsp;&nbsp;&nbsp;✅ REST API&nbsp;&nbsp;&nbsp;✅ Scalable MERN Stack

</div>

<br/>

## 👥 Team

<div align="center">

### 🎖 Team Leader

**Tharanish B**

### 🧑‍🤝‍🧑 Team Members

| | | |
|:--:|:--:|:--:|
| Tamil Mutharasan D | Yogesh J | Yuvarajan M |

</div>

<br/>

## 🎯 Built For

<div align="center">

### 🏆 Odoo Hackathon 2026

> *Building the next generation Enterprise Asset & Resource Management Platform.*

</div>

---

<div align="center">

### ⭐ If you like this project, give it a Star ⭐

Made with ❤️ by **YT Squad**

</div>
