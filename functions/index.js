const functions = require("firebase-functions");
var admin = require("firebase-admin");

admin.initializeApp();

var db = admin.database();
var ref = db.ref("users/");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.scheduledFunctionCrontab = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("America/New_York")
  .onRun((context) => {
    ref
      .once("value")
      .then((snapshot) => {
        Object.keys(snapshot.val()).map((user) => {
          Object.keys(snapshot.val()[user]).map((key) => {
            if (key === "nutrition") {
              Object.keys(snapshot.val()[user][key]).map((nutrient) => {
                var toBeUpdated = snapshot.val()[user][key][nutrient][0];
                var unit = toBeUpdated.replace(/[0-9]/g, "");
                var final = "0" + unit;
                db.ref("users/" + user + "/" + key + "/" + nutrient).update({
                  0: final,
                });
              });
            }
          });
        });
        return null;
      })
      .catch((err) => {
        console.log(err);
      });
  });
