# Global Scientific Trade Pvt. Ltd. — Platform Documentation

A modern, full-stack scientific and industrial product trading platform combining a corporate website, an e-commerce catalog, an institutional ordering & quotation system, and a comprehensive administrative control panel.

---

## 1. Company Profile & Information Source

- **Company Name:** Global Scientific Trade Pvt. Ltd.
- **Office Location:** Swayambhu, Kathmandu, Nepal
- **Phone Numbers:** +977-9847879700 / +977-9828991631
- **Official Email:** gsciencehouse2077@gmail.com
- **Social Media:** [TikTok: @gscientific2077](https://tiktok.com/@gscientific2077)
- **Primary Business:** Turnkey supply and installation of educational science lab equipment, civil engineering & material testing apparatus, mathematics learning kits, and Bal Bikas early childhood development & Montessori materials.

---

## 2. Core Initial Departments (Dynamic & Expandable)

1. **Science Laboratory Equipment**
   - Physics, Chemistry, Biology, Optics, Microscopy, and Analytical Glassware/Plasticware.
2. **Civil Engineering Equipments & Tools**
   - Concrete Testing, Cement Testing, Soil Testing, Asphalt/Bitumen, Aggregate Testing, Surveying, and Workshop Tools.
3. **Mathematics Lab & Learning Tools**
   - 2D/3D Geometric Models, Algebraic Identity Demonstrators, Magnetic Fraction Sets, Place Value Abacuses, and Time Teaching Aids.
4. **Bal Bikas / Children ECD & Montessori Materials**
   - Counting Frames, Wooden Puzzle Trays, Mega Blocks, Indoor/Outdoor Rockers & Seesaws, Traditional Cultural Attire, and Social Science Kits.

---

## 3. Technology Stack

- **Backend:** Node.js v22 LTS with Express.js REST API
- **Database:** SQLite (`database/global_scientific.db`) via `better-sqlite3` with WAL mode
- **Frontend:** React 18, React Router v6, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Build Tool:** Vite v6
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **File Uploads:** Multer with mime-type validation and server-side disk storage in `uploads/products/`

---

## 4. Quick Start & Execution

### Start the Unified Production Server
```bash
# Starts the server on port 5000 (serving both API and React SPA frontend)
npm start
```
Access in your browser:
- Public Website: `http://localhost:5000`
- Admin Control Center: `http://localhost:5000/admin`

### Database Seeding
To re-seed the database with real catalog equipment:
```bash
npm run seed
```

### Development Mode (Concurrent)
```bash
# Run server
npm run dev

# Run client dev server (in another terminal)
npm run client
```

---

## 5. Administrative Credentials

- **Admin Login URL:** `http://localhost:5000/admin/login`
- **Username:** `admin`
- **Password:** `AdminPassword2026!`
*(Credentials can be updated anytime inside the Admin Settings panel).*

---

## 6. Key System Capabilities

- **Zero-Code Category Expansion:** Admin can add, reorder, edit, and deactivate unlimited categories dynamically.
- **Flexible Product Specifications:** Custom key-value pairs (Capacity, Dimensions, Voltage, Material, Accuracy, Measurement Range, etc.).
- **Real Product Image Uploader:** Allows administrators to upload genuine product photographs with instant preview. If no image is provided, a clean, category-branded technical schematic is displayed without misleading photos.
- **Dual Purchase Flow:**
  - **Buy Now:** Direct order placement for fixed-price instruments.
  - **Request a Quote:** In-depth proforma request form for custom institutional supply.
- **Shopping Cart & Checkout:** Persistent browser storage; customers can submit orders without registration.
- **Order Lifecycle Management:** 8-stage order status workflow (`New Order` -> `Under Review` -> `Contacted` -> `Quotation Sent` -> `Confirmed` -> `Processing` -> `Completed` -> `Cancelled`) with timestamped audit history and internal staff notes.
- **Printable Order Slips:** Browser-printable invoice and packing slips.
- **Dynamic Content Management:** Admin can modify company address, phone numbers, emails, social links, and "About Us" story from the dashboard.
