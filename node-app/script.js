// This script demonstrates how to authenticate with the Google Sheets API
// and retrieve data from a spreadsheet using Node.js

const { google } = require("googleapis");
const sheets = google.sheets("v4");

const auth = new google.auth.GoogleAuth({
  keyFile:
    "/Users/mark/Documents/patient-incident-report-form/node-app/credentials/qapi-elamj-de7d7e97aecb.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Verify access by fetching spreadsheet data
sheets.spreadsheets.values.get(
  {
    auth: auth,
    spreadsheetId: "1PilGgXRy5aFpzCWN7s7_mAQmfsF6lK6x16MdyZpcrJ4",
    range: "Sheet1", // Replace with your sheet name
  },
  (err, response) => {
    if (err) {
      console.error("Error accessing spreadsheet:", err);
      return;
    }

    console.log("Spreadsheet Data:", response.data.values);
  }
);
