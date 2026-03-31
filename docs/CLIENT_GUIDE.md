# Client Guide - Training LMS

This project is a simple training LMS with only 3 main pages:

- Courses List
- Course Detail (SCORM Player)
- Admin Panel

There is no login/authentication step required for normal use.

## Project Setup and Run

Recommended versions:

- Node.js: `20.x` (minimum: 20+)
- npm: `10.x` (recommended)

Check installed versions:

```bash
node -v
npm -v
```

Install dependencies:

```bash
npm install
```

Environment setup:

1. No additional `.env` setup is required for client usage if backend API integration is already configured in this project.
2. Keep using the current project configuration.

Run development server:

```bash
npm run dev
```

Open in browser:

- [http://localhost:3000](http://localhost:3000)

Build for production:

```bash
npm run build
```

Run production server:

```bash
npm run start
```

Useful note:

- `npm run start` uses `server.js` and respects the `PORT` environment variable.

## 1) Courses List Page

URL: `/courses`

Purpose:

- Show all available training courses
- Let users open a selected course

How to use:

1. Open the LMS URL.
2. You will land on the course list.
3. Click **Open Course** on any course card.

## 2) Course Detail Page

URL pattern: `/courses/{courseId}`

Purpose:

- Play the SCORM training content for the selected course
- Show related courses below the player

How to use:

1. Open a course from the list page.
2. The SCORM content appears in the embedded player.
3. Complete the training directly in that page.

## 3) Admin Panel

URL: `/admin`

Purpose:

- Add or update training courses
- Upload platform logo
- Manage existing products from a products table

### A) Products Table (View / Edit / Delete / Add)

In Admin, a products table is shown with:

- Product ID
- Title
- Tag
- Action buttons: **Edit** and **Delete**
- Top-right **Add Product** button

#### Add Product (Popup Modal)

Required fields:

- Product ID
- Product Title
- Product Tag
- Product Description
- Product Image
- Product SCORM File (`.zip`)

Steps:

1. Go to `/admin`.
2. Click **Add Product** (opens modal popup).
3. Fill all required fields.
4. Select the product image and SCORM zip file.
5. Click **Add Product**.

Result:

- Product appears in the table and course list
- SCORM package is extracted and made playable
- Course image is shown in the course card
- Product tag appears in the table **Tag** column

#### Edit Product (Popup Modal)

Steps:

1. In products table, click **Edit** on the target row.
2. Edit title, tag, and description in the popup modal.
3. Click **Save Changes**.

Result:

- Product information updates immediately in the table and courses page.
- Updated tag is reflected in the table.

#### Delete Product

Steps:

1. In products table, click **Delete** on the target row.
2. Confirm deletion.

Result:

- Product is removed from table and courses page.

#### Notes

- Product ID is fixed during edit.
- To replace SCORM package or course image, add again using the same Product ID.

### B) Logo Upload

Steps:

1. In `/admin`, go to **Logo Upload**.
2. Select logo file.
3. Click **Upload Logo**.

Result:

- New logo is applied in the LMS header.

## SCORM Package Requirements

Upload a valid `.zip` SCORM package.  
The system auto-detects launch file from:

- `index.html` (preferred)
- `imsmanifest.xml` launch target
- Common fallback files (example: `story.html`, `launch.html`)

If no valid launch file is found, upload will fail.

## Where Data Is Stored

Uploaded content is stored in:

- `.data/admin.json` (course and logo metadata)
- `public/uploads/scorm/` (extracted SCORM files)
- `public/uploads/course-images/` (course thumbnails)
- `public/uploads/logo/` (logo files)

For production use, keep these locations persistent across restarts/deployments.

## Quick Troubleshooting

- **Courses page is empty**
  - Upload at least one course from `/admin`.
- **Course does not open**
  - Re-check SCORM zip and ensure it has a valid launch page.
- **Edit not saving**
  - Ensure title, tag, and description are not empty.
- **Delete not working**
  - Refresh and retry; if needed verify file permissions for `.data`.
- **Logo not changed**
  - Upload again and hard refresh browser.

