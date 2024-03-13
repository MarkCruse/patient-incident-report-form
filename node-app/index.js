const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const credentials = require("/Users/mark/Documents/patient-incident-report-form/node-app/credentials/qapi-elamj-de7d7e97aecb.json");

const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.error("Error authorizing Google Sheets API:", err);
    console.error("Exiting server due to authorization error.");
    process.exit(1); // Stop the server in case of authorization error
    return;
  }

  console.log("Successfully authorized Google Sheets API");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function writeToGoogleSheet(formData) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    const spreadsheetId = "1PilGgXRy5aFpzCWN7s7_mAQmfsF6lK6x16MdyZpcrJ4";
    const sheetName = "Sheet1";

    sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: sheetName,
        valueInputOption: "RAW",
        resource: {
          values: [Object.values(formData)],
        },
      },
      (err, result) => {
        if (err) {
          console.error("Error writing to Google Sheet:", err);
          reject(err);
        } else {
          console.log("Data written to Google Sheet");
          //console.log("Data written to Google Sheet:", result.data);
          resolve(result.data);
        }
      }
    );
  });
}

function formatDateString(dateString) {
  // Convert the string to a Date object
  var date = new Date(dateString);

  // Get the formatted date in mm-dd-yyyy format
  var formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
}

app.post("/submitForm", async (req, res) => {
  const formData = req.body;

  try {
    // Wait for the writeToGoogleSheet function to complete before proceeding
    // await writeToGoogleSheet(formData);

    //  const responseData = `
    //   <h2>Form submitted successfully!</h2>
    //    <h3>Submitted Data:</h3>
    //   <pre>${JSON.stringify(formData, null, 2)}</pre>
    // `;

    // Access individual fields
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString("en-US", {
      timeZone: "America/New_York",
    }); // Example format: "12/31/2023, 10:30:45 AM"

    const nameString = `<strong>Name:</strong> ${formData.name.padEnd(40)}`;
    const mrNumString = `<strong>MR#:</strong> ${formData.mr_num.padEnd(24)}`;
    const dobString = formatDateString(formData.dob);
    formData.dob = dobString;
    dobStr = `<strong>DOB:</strong> ${dobString}`;

    const line1 = nameString + " " + mrNumString + " " + dobStr;
    const diagnosisString = `<strong>Main Diagnosis:</strong> ${formData.diagnosis.padEnd(
      60
    )}`;
    const careDateString = `<strong>Start of Care Date:</strong> ${formatDateString(
      formData.care_date
    )}`;
    formData.care_date = formatDateString(formData.care_date);
    const line2 = diagnosisString + " " + careDateString;

    const incidentDateString = `<strong>Date of Incident:</strong> ${formatDateString(
      formData.incident_date
    ).padEnd(28)}`;
    formData.incident_date = formatDateString(formData.incident_date);
    const incidentTimeStr = formData.incident_time;

    // Split the time string into hours and minutes
    const [hours, minutes] = incidentTimeStr.split(":");

    // Get today's date
    const today = new Date();

    // Set the time on the Date object
    today.setHours(hours);
    today.setMinutes(minutes);

    // Format the time in 12-hour format with AM/PM
    const formattedTime = today.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    formData.incident_time = formattedTime;
    const incidentTimeString = `<strong>Time of Incident:</strong> ${formattedTime}`;

    const line3 = incidentDateString + " " + incidentTimeString;
    const line4 = `<strong>Description of Event:</strong> ${formData.description.padEnd(
      130
    )}`;
    const preOccurString = `<strong>Pre-Occurrence Condition:</strong> ${formData.pre_occur.padEnd(
      20
    )}`;
    const postOccurString = `<strong>Post-Occurrence Condition:</strong> ${formData.post_occur}`;
    const line5 = preOccurString + " " + postOccurString;
    const fallObservedString = `<strong>Fall Observed/Unobserved:</strong> ${formData.fall_observed.padEnd(
      20
    )}`;
    const inOutHomeString = `<strong>Fall In/Out of Home:</strong> ${formData.in_outHome}`;
    const line6 = fallObservedString + " " + inOutHomeString;

    const causeOfFallString = `<strong>Cause of Fall:</strong> ${formData.fall_cause.padEnd(
      31
    )}`;
    const otherFallCause =
      formData.other_fall_cause !== "" ? formData.other_fall_cause : "NA";
    const otherCauseOfFallString = `<strong>Other Cause of Fall:</strong> ${otherFallCause}`;
    const line7 = causeOfFallString + " " + otherCauseOfFallString;

    const locationOfFallString = `<strong>Location of Fall:</strong> ${formData.fall_loc.padEnd(
      28
    )}`;
    const otherFallLoc =
      formData.other_fall_loc !== "" ? formData.other_fall_loc : "NA";
    const otherLocationOfFallString = `<strong>Other Location of Fall:</strong> ${otherFallLoc}`;
    const line8 = locationOfFallString + " " + otherLocationOfFallString;

    const medicationString = `<strong>Medication:</strong> ${formData.medication.padEnd(
      34
    )}`;
    const drugReactionStr =
      formData.drug_react !== "" ? formData.drug_react : "NA";
    const drugReactString = `<strong>Drug Reaction:</strong> ${drugReactionStr}`;
    const line9 = medicationString + " " + drugReactString;

    const equipmentString = `<strong>Equipment:</strong> ${formData.equip.padEnd(
      35
    )}`;
    const misuseString = `<strong>Misuse By:</strong> ${formData.misuse_by}`;
    const line10 = equipmentString + " " + misuseString;

    const otherString = `<strong>Other:</strong> ${formData.other2.padEnd(39)}`;
    const line11 = otherString;

    const behaviorString = `<strong>Patient/Caregiver Behavior:</strong> ${formData.patient_behav.padEnd(
      18
    )}`;
    const line12 = behaviorString;

    const injuryString = `<strong>Nature of Injury:</strong> ${formData.injury.padEnd(
      28
    )}`;
    const otherInjuryStr =
      formData.other_injury !== "" ? formData.other_injury : "NA";
    const otherInjuryString = `<strong>Other Injury:</strong> ${otherInjuryStr}`;
    const line13 = injuryString + " " + otherInjuryString;

    const followUpString = `<strong>Follow Up:</strong> ${formData.followup}`;
    const line14 = followUpString;

    const additionalActionsString = `<strong>Additional Actions Recommended:</strong> ${formData.add_actions}`;
    const line15 = additionalActionsString;

    const signatureString = `<strong>Signature:</strong> ${formData.signature.padEnd(
      35
    )}`;
    const titleString = `<strong>Title:</strong> ${formData.title}`;
    const line16 = signatureString + " " + titleString;

    // Build a custom HTML response based on the form data
    const responseData = `  
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><center>Patient Incident Report</center></title>
        <!-- Link to Bootstrap CSS (optional) -->
        <link
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            margin-top: 20px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <p>Form submitted successfully at ${formattedDateTime}</p>
          <div><h1>Patient Incident Form</h1></div>
          <div><p>&nbsp;</p></div>

          <div><pre>${line1}</pre></div>
          <div><pre>${line2}</pre></div>
          <div><pre>${line3}</pre></div>
          <div><pre>${line4}</pre></div>
          <div><pre>${line5}</pre></div>
          <div><pre>${line6}</pre></div>
          <div><pre>${line7}</pre></div>
          <div><pre>${line8}</pre></div>
          <div><pre>${line9}</pre></div>
          <div><pre>${line10}</pre></div>
          <div><pre>${line11}</pre></div>
          <div><pre>${line12}</pre></div>
          <div><pre>${line13}</pre></div>
          <div><pre>${line14}</pre></div>
          <div><pre>${line15}</pre></div>
          <div><p>&nbsp;</p></div>
          <div><pre>${line16}</pre></div>
          <!-- Buttons section -->
          <div class="row mt-4">
            <div class="col">
              <button type="button" class="btn btn-primary" onclick="continueForm()">Continue</button>
            </div>
          </div>

          <!-- Include Bootstrap JS and jQuery (optional) if needed -->
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

          <!-- Custom script for button actions -->
          <script>
            function continueForm() {
              // Add logic to reset the form or redirect to the blank form page
              // For example, you can use JavaScript to redirect to the form page:
              window.location.href = "/"; // Change the URL accordingly
            }
          </script>
        </div>
      </body>
    </html>
    `;

    // Send the HTML response
    res.send(responseData);
  } catch (error) {
    console.error("Error processing form:", error);
    res.status(500).send("Internal Server Error");
  }
  // Wait for the writeToGoogleSheet function to complete before proceeding
  await writeToGoogleSheet(formData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
