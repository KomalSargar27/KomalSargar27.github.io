# Komal Sargar portfolio website

A ready-to-publish website for GitHub Pages. No installing or coding is needed.

## 1. Put the website online (about 10 minutes)

1. Unzip this folder on your computer.
2. Sign in at github.com. Click the **+** button at the top right, then **New repository**.
3. Name the repository exactly: `KomalSargar27.github.io` (your username, then `.github.io`). Choose **Public**, then click **Create repository**.
4. On the new repository page, click **uploading an existing file**.
5. Open the unzipped folder, select everything inside it (`index.html`, the `css` folder, the `js` folder and the `assets` folder) and drag it all into the GitHub page. Use Chrome or Edge so the folders upload too.
6. Wait until the upload finishes, then click **Commit changes**.
7. In the repository, open **Settings**, then **Pages**. Under "Build and deployment", set Source to **Deploy from a branch**. Set the branch to **main**, the folder to **/ (root)**, and click **Save**.
8. After one or two minutes your website is live at: https://komalsargar27.github.io
   (GitHub's menu names can look slightly different from this guide, but the steps are the same.)

## 2. Add your screenshots, videos and certificate photos

You do not need to change any code. Put the files in the right folder with the exact names below, and the website finds them by itself.
Screenshots and photos can be `.png` or `.jpg`. Videos must be `.mp4`.

### Project screenshots and videos: folder `assets/projects`

| Project | Screenshots (up to 4) | Demo video |
|---|---|---|
| PhonePe dashboard | `phonepe-1.png`, `phonepe-2.png`, `phonepe-3.png`, `phonepe-4.png` | `phonepe-demo.mp4` |
| Blinkit SQL analysis | `blinkit-1.png` to `blinkit-4.png` | `blinkit-demo.mp4` |
| Online Book Sales dashboard | `book-sales-1.png` to `book-sales-4.png` | `book-sales-demo.mp4` |
| Online Retail analysis | `online-retail-1.png` to `online-retail-4.png` | `online-retail-demo.mp4` |

The first screenshot becomes the picture on the project card. If there is no screenshot but there is a video, the card shows the video instead.

### Certificate photos: folder `assets/certificates`

- `sql-skillcourse.png` (30-Day SQL Micro Course)
- `powerbi-skillcourse.png` (30-Day Power BI Micro Course)
- `excel-skillcourse.png` (Microsoft Excel: Beginner to Advanced)
- `deloitte-forage.png` (Data Analytics Job Simulation)

### Your photo (optional): folder `assets`

- `photo.png` or `photo.jpg`. A square picture of your face works best. Without it, the website shows your initials.

### How to add the files on GitHub

1. Open your repository on github.com and go into the right folder, for example `assets/projects`.
2. Click **Add file**, then **Upload files**, drag your files in and click **Commit changes**.
3. Wait about a minute, then refresh your website.

Tips for videos:
- Keep each video under 25 MB, because GitHub's web upload has that limit.
- 20 to 40 seconds at 720p is enough. On Windows, press `Win + Alt + R` to record.
- Hide anything private before you record.

## 3. Change the text or add a project

All the text lives in one file: `js/data.js`. On GitHub, open that file and click the pencil icon to edit it. Each project has a title, description, key points, tools and a GitHub link. Copy an existing project block to add a new one.

If you have a Power BI report link later, add it to a project as `live: "https://..."`. Ask Claude for the small code change that shows an "Open live report" button.

## 4. Before you publish

Your resume PDF (`assets/Komal_Sargar_Resume.pdf`) contains your phone number, and anyone who visits the website can download it. If you do not want that, replace it with a version without your phone number, keeping the same file name.

## Showing your SQL projects
SQL has no dashboard, so the Blinkit project is shown as a case study: the business questions, key insights, then query screenshots.
- Eight Blinkit queries are already shown. To add result screenshots, save them as `assets/projects/blinkit-1.png` to `blinkit-4.png`.
- Excel certificate photo: save it as `assets/certificates/excel-skillcourse.jpg`.
