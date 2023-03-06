const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.updateRole = functions.firestore
    .document("roles/{userId}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        const customClaims = {
            role: newValue.role
        };

        return admin.auth().setCustomUserClaims(context.params.userId, customClaims)
            .then(() => {
                console.log("Updated role successfully!");
            })
            .catch(error => {
                console.log(`Error updating role: ${error}`);
            });
    });