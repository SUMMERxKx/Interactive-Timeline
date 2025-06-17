# TRU-Themed Interactive Timeline Tool

This is a privacy-first, TRU-branded timeline planner that allows students to visually plan their academic journey semester by semester. It is designed to be embedded into academic websites or LMS portals and fully functions offline with no data storage or tracking.

---

## 🎯 Purpose

- Help TRU students plan 1–6 academic years.
- Break down each year into **Fall**, **Winter**, and **Summer** semesters.
- Allow interactive editing of each semester’s goals or milestones.
- Offer **Download as .txt** and **Print to PDF** options.
- Ensure accessibility, responsiveness, and full privacy.
- Embed safely in iframes using sandboxed settings.

---

## ✅ Features

- 🔧 Custom input: “Years until graduation” (1–6)
- 📅 Auto-generates editable timeline grid (Year × Semester)
- ✏️ Click any semester to edit a personal plan
- 💾 Download button exports all plans as `student_timeline_plan.txt`
- 🖨 Print button uses custom print stylesheet for clean PDF saving
- 🌐 Fully offline-capable (no internet required after load)
- 🔒 No cookies, no localStorage, no network calls
- ♿ Keyboard and screen reader accessible
- 📱 Responsive layout for mobile and small screens

---

## 🖼 Visual Style (TRU Themed)

- **Primary Color**: `#0055A5` (TRU Blue)
- **Accent Color**: `#0072CE`
- **Typography**: System UI font or optional `"Lora"`/`"Inter"`
- **Feel**: Clean, minimal academic layout with animated transitions

---

## 🔒 Privacy and Security

- No analytics, cookies, or tracking
- No user data stored or sent anywhere
- Uses `Content-Security-Policy` to restrict third-party access
- Works inside `<iframe>` with:
  ```html
  sandbox="allow-scripts allow-downloads"
