require('dotenv').config();
const ProfileStyleService = require('./index.js');

console.log("Starting GLOW Display Name Styles Service...");

ProfileStyleService.initialize({})
  .then(report => {
    console.log("\n--- FINAL REPORT ---");
    console.log(JSON.stringify(report, null, 2));
  })
  .catch(err => {
    console.error("Failed to run service:", err);
  });
