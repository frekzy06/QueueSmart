const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.resetQueue = functions.https.onCall(async (data, context) => {
  // Only allow admins
  // Logic to delete all docs in 'queue' where locationId == data.locationId
  const collectionRef = admin.firestore().collection('queue');
  const snapshot = await collectionRef.where('locationId', '==', data.locationId).get();
  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  return { success: true };
});