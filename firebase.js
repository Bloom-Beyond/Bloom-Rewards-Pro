import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBH3QSgukJzW0RAJWJ9qqsoSAApUey8cZ8",
  authDomain: "bloom-rewards-pro.firebaseapp.com",
  projectId: "bloom-rewards-pro",
  storageBucket: "bloom-rewards-pro.firebasestorage.app",
  messagingSenderId: "613316349558",
  appId: "1:613316349558:web:eb9d3ac5bcfe4addd01957"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

alert("Firebase Connected Successfully");

export { db };
