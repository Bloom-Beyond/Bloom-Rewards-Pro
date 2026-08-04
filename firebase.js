// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBH3QSgukJzW0RAJWJ9qqsoSAApUey8cZ8",
  authDomain: "bloom-rewards-pro.firebaseapp.com",
  projectId: "bloom-rewards-pro",
  storageBucket: "bloom-rewards-pro.firebasestorage.app",
  messagingSenderId: "613316349558",
  appId: "1:613316349558:web:eb9d3ac5bcfe4addd01957",
  measurementId: "G-NWTSYSJDB2"
};

// Initialize
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

