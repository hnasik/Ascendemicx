// assets/js/firebase-init.js
// Initialize Firebase (Compat)
const firebaseConfig = {
  apiKey: "AIzaSyB_koQMCVFcp7a6Bu8q54vO9W5Xsll5jW4",
  authDomain: "ascendemicx-814d2.firebaseapp.com",
  projectId: "ascendemicx-814d2",
  storageBucket: "ascendemicx-814d2.firebasestorage.app",
  messagingSenderId: "288541987116",
  appId: "1:288541987116:web:bfc142049de2a9265a9c89",
  measurementId: "G-WJKQKMXN4R"
};

if (!window.firebase) {
  console.warn('Firebase SDKs not loaded yet.');
} else {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  try { window.db = firebase.firestore(); } catch(e){ window.db = null; }
  try { window.auth = firebase.auth(); } catch(e){ window.auth = null; }
  try { window.storage = firebase.storage(); } catch(e){ window.storage = null; }
  console.log('Firebase initialized.');
}
