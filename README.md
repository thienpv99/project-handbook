# 🏦 VietBank — Interactive Deployment Runbook

> **Version:** v2.4 · 2025 Q2  
> **Classification:** INTERNAL USE ONLY — CONFIDENTIAL  
> **Compliance:** SBV Circular 09/2020/TT-NHNN · ISO 27001 Aligned

A governed, interactive single-page runbook for software releases under the **Hybrid Water-Scrum-Fall** model at a Vietnamese commercial bank.

---

## 📁 Project Structure

```
bank-runbook/
├── index.html            # Main entry point — full page markup
├── README.md             # This file
├── .gitignore
├── assets/
│   ├── css/
│   │   └── styles.css    # Superhuman-inspired design system (dark mode, purple glow)
│   └── js/
│       └── main.js       # Sidebar, accordion, role tabs, DoD checklist logic
└── docs/
    └── (supplementary documentation)
```

---

## 🚀 Running Locally

Since this is a **pure static site** (no build step), you can open it directly or serve it:

### Option 1 — Open directly
Double-click `index.html` in File Explorer to open in your browser.

> ⚠️ Google Fonts requires an internet connection. The page will still function offline with fallback system fonts.

### Option 2 — Local HTTP server (PowerShell, no install needed)
```powershell
$port = 5500
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving at http://localhost:$port"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $filePath = Join-Path (Get-Location) $ctx.Request.Url.LocalPath.TrimStart('/')
    if ($ctx.Request.Url.LocalPath -eq '/') { $filePath = Join-Path (Get-Location) 'index.html' }
    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ctx.Response.ContentType = 'text/html; charset=utf-8'
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $ctx.Response.OutputStream.Close()
}
```

---

## 🎨 Design System

Inspired by **Superhuman's "Carbon"** dark UI:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0d0d0f` | Page background |
| `--bg-elevated` | `#1c1c1f` | Cards |
| `--accent` | `#7c5cfc` | Sidebar active, highlights |
| `--accent-bright` | `#9b7dff` | Text accents, glow |
| `--status-green` | `#34d399` | Done / approved |
| `--status-yellow` | `#fbbf24` | In progress / active |
| `--status-red` | `#f87171` | Blocked / critical |

Typography: **Inter** (sans) + **JetBrains Mono** (code) via Google Fonts.

---

## 📋 Sections

| # | Section | SDLC Model |
|---|---------|------------|
| 1 | Governance & Hybrid SDLC Overview | — |
| 2 | Phase 1 — Discovery & Project Initiation | Waterfall |
| 3 | Phase 2 — Implementation | Agile/Scrum |
| 4 | Phase 3 — "Last Mile" Pre-Deployment | Waterfall |
| 5 | Phase 4 — Deployment & Commercialization | Waterfall |

---

## ⚡ Interactive Features

- **Sticky sidebar** with scroll-aware active link highlighting (Intersection Observer)
- **Collapsible accordions** for compliance pillars and deployment artifacts
- **12-step release pipeline** with hover tooltips and animated active state
- **Role perspective tabs** — switch between Release Manager, Performance Tester, Security Tester
- **Release DoD checklist** — clickable items with live progress bar and completion banner
- **Responsive layout** — collapses to mobile with hamburger sidebar toggle

---

## ⚖️ Compliance

This runbook documents processes compliant with:
- **SBV Circular 09/2020/TT-NHNN** — IT Safety Regulations for credit institutions
- **Internal Change Advisory Board (CAB)** governance policy
- **ISO 27001** information security management alignment

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| v2.4 | 2025-Q2 | Redesigned UI (Superhuman dark theme), refactored into separate CSS/JS files |
| v2.3 | 2025-Q1 | Added 12-step pipeline tracker, role tabs |
| v2.0 | 2024-Q4 | Initial interactive runbook |
