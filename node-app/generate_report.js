// This script demonstrates how to use Puppeteer to automate the creation of reports from 
// provided data, allowing for the generation of both image and PDF versions of the report.

const puppeteer = require("puppeteer");

async function generateReport() {
  // Sample data
  const reportData = [
    {
      time: "2024-01-01T12:00:00",
      field1: "Value1A",
      field2: "Value1B",
      field3: "Value1C",
    },
    {
      time: "2024-01-02T14:30:00",
      field1: "Value2A",
      field2: "Value2B",
      field3: "Value2C",
    },
    // Add more data as needed
  ];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Build the HTML content dynamically based on the reportData
  const reportContent = `
    <html>
      <head>
        <title>Multi-Field Report</title>
        <style>
          .report-entry {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Multi-Field Report</h1>
        <div class="report-container">
          ${reportData
            .map(
              (entry) => `
            <div class="report-entry">
              <div class="timestamp">${entry.time}</div>
              <div class="field">${entry.field1}</div>
              <div class="field">${entry.field2}</div>
              <div class="field">${entry.field3}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </body>
    </html>
  `;

  await page.setContent(reportContent);

  // Take a screenshot of the page
  await page.screenshot({ path: "multi-field-report-screenshot.png" });

  // Generate a PDF of the page
  await page.pdf({ path: "multi-field-report.pdf", format: "A4" });

  await browser.close();

  console.log("Multi-Field Report generated successfully.");
}

// Call the function to generate the report
generateReport();
