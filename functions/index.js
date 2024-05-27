
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/v2/https");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");


initializeApp();
/** *********************************************** SAMPLE CODE
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;


  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
      .collection("messages")
      .add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({uppercase}, {merge: true});
});
*************************************************/


// Listens for changes to the /sprinkler/isOn document
// Sends an email notification with to the users listed under /mail/to

exports.updateuser = onDocumentUpdated("sprinkler/main", (event) => {
  // Get an object representing the document
  const newValue = event.data.after.data();
  const isOn = newValue.isOn; // .toString();
  const duration = newValue.durationInMins;
  const offTime = newValue.offTime;
  // if no emails exist, we need to default to this one.
  let emailString = "robertocannella@gmail.com";


  // Get list of email address to notify
  const docRef = getFirestore().collection("mail").doc("to");
  docRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data().email;
      const emails = [];
      data.forEach((user) => {
        emails.push(user.email);
      });
      emailString = emails.join(", ");
      // logger.log("emails: ", emailString);

      let formattedDate = "";
      // Date Time formatting:
      if (offTime) {
        const date = offTime.toDate();

        // Options to format the date in Eastern Time
        const options = {
          timeZone: "America/New_York",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // for 12-hour clock
        };

        // Format the date
        formattedDate = date.toLocaleString("en-US", options);
      }

      // Update the document.
      // There is an extension installed within firebase
      // console to mail all items in this document.
      // https://console.firebase.google.com/project/aidatapipes/extensions

      let body = (isOn ? "The Sprinkler is on." : "The Sprinkler is off");
      body += (offTime) ?
        `\n Timer is set for ${duration} minutes. 
        \n\nThe Sprinkler will turn off:  ${formattedDate}` :
        "";

      getFirestore()
          .collection("mail").add({
            to: emailString,
            message: {
            // name: this.contactForm.value.contactFormName,
            // email: this.contactForm.value.contactFormEmail,
              subject: "A.I. DataPipes Alert",
              text: body,
            },
          });
      // logger.log("event: ", event);
      // logger.log("readResult", readResult);
    } else {
      logger.error("no such document!");
    }
  }).catch((error) => {
    logger.error("error getting document: ", error);
  });
});


// Function to control timer on/off

// exports.setTimer = onDocumentUpdated("sprinkler/timer", (event) => {
//   try {
//     if (!event.data || !event.data.after) {
//       logger.error("No data found in the event.");
//       return;
//     }

//     const newValue = event.data.after.data();

//     if (!newValue) {
//       logger.error("No new data found in the updated document.");
//       return;
//     }

//     const time = newValue.time ?
//       newValue.time.toString() :
//       "No timer field found";
//     logger.log("time", time);
//   } catch (error) {
//     logger.error("Error processing document update:", error);
//   }
// });
