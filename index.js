const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.get("/", (request, response) => {
  response.render("index");
});

app.post("/", async (request, response) => {
  const { name, mobile } = request.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const spreadsheetId = "1dVoZoei9ugVcgL13C7Lty2dEPF1iZbPJl_S_6kUZBEc";

  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, mobile]],
    },
  });
  response.send(
    "Data added to sheet, to add additional data open the link in another tab!"
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
