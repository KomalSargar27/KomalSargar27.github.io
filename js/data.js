/*
  All the content of the website lives in this file.
  To change text, add a project, or add a certificate, edit it here.

  Pictures and videos are found by file name, so you do not edit code to add them:
    - Project screenshots: assets/projects/<name>-1.png ... <name>-4.png  (png or jpg)
    - Project video:       assets/projects/<name>-demo.mp4
    - Certificate photo:   assets/certificates/<name>.png  (png or jpg)
    - Your photo:          assets/photo.png  (png or jpg), optional
  If a file is missing, the site shows a neat placeholder instead.
*/
window.SITE = {
  github: "https://github.com/KomalSargar27",
  linkedin: "https://www.linkedin.com/in/komal-sargar-49b81b30b",
  email: "sargarkomal27@gmail.com",
  resume: "assets/Komal_Sargar_Resume.pdf",
  photo: "assets/photo",

  toolNames: { pbi: "Power BI", sql: "SQL", xls: "Excel", py: "Python" },

  skills: [
    { title: "SQL", items: ["MySQL", "PostgreSQL", "JOINs", "Aggregate functions", "GROUP BY", "CASE statements", "Subqueries", "Window functions"] },
    { title: "Dashboards and BI", items: ["Power BI", "DAX", "Data modeling", "Power Query", "KPI cards", "Slicers", "Cross-filtering", "Tableau"] },
    { title: "Spreadsheets", items: ["Advanced Excel", "Pivot tables", "Pivot charts", "VLOOKUP", "Excel dashboards", "Google Sheets"] },
    { title: "Data cleaning and analysis", items: ["Data cleaning", "Validation and transformation", "Data quality checks", "EDA", "KPI and trend analysis"] },
    { title: "Programming and tools", items: ["Python", "Pandas", "NumPy", "Seaborn", "Git", "GitHub"] }
  ],

  projects: [
    {
      tool: "pbi", featured: true, seed: 5,
      title: "PhonePe Transaction Analytics Dashboard",
      desc: "Interactive Power BI dashboard on 300K+ transactions worth over ₹3bn across 101K users, built to monitor transaction health, service-wise revenue and failure trends.",
      points: [
        "8+ visuals with cross-filtering by service type, payment status, date range and user demographic",
        "DAX measures for success rate (96.65%), failed transaction rate and monthly volume across 12 months",
        "Loans had the highest transaction value at ₹2.5bn despite fewer transactions, which points risk and fraud monitoring there"
      ],
      stack: ["Power BI", "DAX", "KPI cards", "Cross-filtering"],
      github: "https://github.com/KomalSargar27/PhonePe-PowerBI-Dashboard",
      media: "phonepe"
    },
    {
      tool: "sql", seed: 19,
      title: "Blinkit Sales, Inventory and Delivery Analysis",
      desc: "Analysis of 13,000+ e-commerce records in PostgreSQL covering sales, profitability, inventory, delivery performance, discounts and customer ratings, using 24 queries. Eight of them are shown below; the full set is on GitHub.",
      points: [
        "Identified top products and categories by sales revenue, quantity sold, profit margin, rating and discount",
        "Flagged products below reorder level and high-demand, low-stock items",
        "20.04% of deliveries (2,605 of 13,000) were delayed, and Lucknow, Jaipur and Mumbai had the most delays",
        "Household and Personal Care generate the highest estimated profit, while Dairy is the lowest"
      ],
      questions: [
        "Which products and categories earn the most revenue and profit?",
        "Which items are below reorder level, and which are high-demand but low in stock?",
        "How do on-time and delayed deliveries compare across cities?",
        "How do discounts and customer ratings relate to sales?"
      ],
      queries: [
        {
                "title": "Q8 · Top 10 products by sales revenue",
                "sql": "SELECT product_name,\n       ROUND(SUM(final_price * sold_quantity), 2) AS revenue\nFROM blinkit_data\nGROUP BY product_name\nORDER BY revenue DESC\nLIMIT 10;"
        },
        {
                "title": "Q12 · Categories with the highest estimated profit",
        "img": "assets/projects/blinkit-4.png",
                "sql": "SELECT category,\n       ROUND(SUM(final_price * sold_quantity * profit_margin_pct / 100), 2) AS estimated_profit\nFROM blinkit_data\nGROUP BY category\nORDER BY estimated_profit DESC;"
        },
        {
                "title": "Q15 · High demand but low stock (subquery)",
                "sql": "SELECT product_name, category, stock, demand_index\nFROM blinkit_data\nWHERE stock < reorder_level\n  AND demand_index > (SELECT AVG(demand_index) FROM blinkit_data)\nORDER BY demand_index DESC;"
        },
        {
                "title": "Q16 · Stock risk levels (CASE)",
                "sql": "SELECT product_name, stock, reorder_level,\n  CASE\n    WHEN stock < reorder_level THEN 'Critical Stock'\n    WHEN stock <= reorder_level * 1.5 THEN 'Low Stock'\n    ELSE 'Healthy Stock'\n  END AS inventory_status\nFROM blinkit_data;"
        },
        {
                "title": "Q17 · On-time vs delayed delivery % (window function)",
        "img": "assets/projects/blinkit-2.png",
                "sql": "SELECT delivery_status,\n       COUNT(*) AS total_deliveries,\n       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS delivery_percentage\nFROM blinkit_data\nGROUP BY delivery_status;"
        },
        {
                "title": "Q18 · Cities with the most delayed deliveries",
        "img": "assets/projects/blinkit-3.png",
                "sql": "SELECT city, COUNT(*) AS delayed_deliveries\nFROM blinkit_data\nWHERE delivery_status = 'Delayed'\nGROUP BY city\nORDER BY delayed_deliveries DESC;"
        },
        {
                "title": "Q22 · Do higher discounts lead to higher sales?",
                "sql": "SELECT\n  CASE\n    WHEN discount_pct = 0  THEN 'No Discount'\n    WHEN discount_pct <= 10 THEN '1-10%'\n    WHEN discount_pct <= 25 THEN '11-25%'\n    WHEN discount_pct <= 50 THEN '26-50%'\n    ELSE 'Above 50%'\n  END AS discount_category,\n  ROUND(AVG(sold_quantity), 2) AS avg_quantity_sold\nFROM blinkit_data\nGROUP BY discount_category\nORDER BY avg_quantity_sold DESC;"
        },
        {
                "title": "Q24 · High rating but low sales (subquery)",
        "img": "assets/projects/blinkit-1.png",
                "sql": "SELECT product_name, category, rating, sold_quantity\nFROM blinkit_data\nWHERE rating >= 4.5\n  AND sold_quantity < (SELECT AVG(sold_quantity) FROM blinkit_data)\nORDER BY rating DESC;"
        }
],
      stack: ["PostgreSQL", "GROUP BY", "CASE", "Subqueries", "Window functions"],
      github: "https://github.com/KomalSargar27/blinkit-sales-inventory-delivery-sql-analysis",
      media: "blinkit"
    },
    {
      tool: "xls", seed: 23,
      title: "Online Book Sales Dashboard",
      desc: "Interactive Excel dashboard that analyzes book sales, revenue, customers, stock, genres and monthly trends.",
      points: ["Tracks book sales and revenue", "Covers customers, stock and genres", "Shows monthly trends"],
      stack: ["Microsoft Excel", "Dashboard"],
      github: "https://github.com/KomalSargar27/Online-Book-Sales-Dashboard",
      media: "book-sales"
    },
    {
      tool: "py", seed: 11,
      title: "Online Retail Analysis",
      desc: "Python analysis of 541,909 retail transactions covering sales trends, customer segments (RFM), returns and repeat-purchase behaviour.",
      points: [
        "Cleaned 541,909 rows down to 522,504 by removing missing descriptions, duplicates, cancelled invoices, zero or negative values and non-product codes",
        "Revenue peaks in November 2011 at 1.45M, and the pre-Christmas season nearly doubles a typical month. The UK brings in 85.1% of revenue",
        "RFM segmentation: 25.8% of customers (Champions) drive 66.1% of revenue, and 656 customers are At Risk",
        "Cohort retention: only 15 to 24% of 2011 customers come back in month 2, so about 8 in 10 do not buy again the next month",
        "Recommendations: plan stock and staff for September to November, reward Champions, win back At Risk customers and push a follow-up offer after the first purchase"
      ],
      stack: ["Python", "pandas", "Matplotlib", "Seaborn", "Jupyter Notebook"],
      github: "https://github.com/KomalSargar27/online-retail-analysis",
      media: "online-retail"
    }
  ],

  certificates: [
    { name: "30-Day SQL Micro Course", issuer: "SkillCourse", year: "2026", covers: "Data exploration, joins, window functions and CASE statements in PostgreSQL.", image: "assets/certificates/sql-skillcourse", verify: "" },
    { name: "30-Day Power BI Micro Course", issuer: "SkillCourse", year: "2026", covers: "Data cleaning, DAX, KPIs and dashboard design.", image: "assets/certificates/powerbi-skillcourse", verify: "" },
    { name: "Microsoft Excel: Beginner to Advanced", issuer: "SkillCourse", year: "2026", covers: "Data cleaning, pivot tables, pivot charts and dashboards. Certificate ID SC-RG1BMQU1GL.", image: "assets/certificates/excel-skillcourse", verify: "" },
    { name: "Data Analytics Job Simulation", issuer: "Deloitte, via Forage", year: "2026", covers: "Practical tasks in data analysis and forensic technology.", image: "assets/certificates/deloitte-forage", verify: "" },
    { name: "ChatGPT for Data Analytics", issuer: "Simplilearn SkillUP", year: "2026", covers: "Using ChatGPT to speed up data analysis work. Certificate code 10791688.", image: "assets/certificates/chatgpt-simplilearn", verify: "" }
  ],

  experience: [
    {
      role: "Freelance Data Analyst", org: "Vamika World (bus operator)", dates: "18 Oct to 1 Nov 2026",
      points: [
        "Designed and delivered a 5-page client-facing Power BI dashboard on 5,500+ booking records, tracking revenue, routes, agents, cancellations and tax",
        "Prepared, cleaned, validated and transformed raw booking data in MySQL, and built a calendar-based data model for consistent reporting",
        "Recovered missing bus numbers for about 7% of records using rules validated on known trips, and flagged inferred values to keep reported figures accurate",
        "Wrote DAX measures for revenue, cancellation rate, commission % and average fare per seat, with navigation and synced slicers so the business can explore data easily"
      ]
    }
  ],

  education: [
    { degree: "MCA", school: "VPIMSR, Sangli", year: "2026", score: "CGPA 8.8 / 10" },
    { degree: "B.Sc", school: "Willingdon College, Sangli", year: "2024", score: "CGPA 8.4 / 10" }
  ]
};
