import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ========================================
// CUSTOMER REGISTRATION
// ========================================

async function saveCustomer() {

  const nameElement = document.getElementById("name");
  const mobileElement = document.getElementById("mobile");

  if (!nameElement || !mobileElement) {
    return;
  }

  const name = nameElement.value.trim();
  const mobile = mobileElement.value.trim();

  if (name === "" || mobile === "") {
    alert("Please enter your name and mobile number.");
    return;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    alert("Please enter a valid 10 digit mobile number.");
    return;
  }

  try {

    const customerRef = doc(db, "customers", mobile);

    const existingCustomer = await getDoc(customerRef);

    let stamps = 0;

    if (existingCustomer.exists()) {
      const oldData = existingCustomer.data();
      stamps = Number(oldData.stamps || 0);
    }

    await setDoc(customerRef, {
      name: name,
      mobile: mobile,
      stamps: stamps,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    localStorage.setItem("customerName", name);
    localStorage.setItem("customerMobile", mobile);
    localStorage.setItem("customerStamps", stamps);

    window.location.href = "card.html";

  } catch (error) {

    console.error("Registration Error:", error);

    alert(
      "Registration failed.\n\n" +
      "Code: " + (error.code || "unknown") +
      "\n\n" +
      "Message: " + error.message
    );
  }
}


// ========================================
// ADMIN LOGIN
// ========================================

function loginAdmin() {

  const pinElement = document.getElementById("pin");

  if (!pinElement) {
    return;
  }

  const pin = pinElement.value.trim();

  if (pin === "2580") {

    localStorage.setItem("adminLoggedIn", "true");

    window.location.href = "dashboard.html";

  } else {

    alert("Wrong Admin PIN.");

  }
}


// ========================================
// ADMIN LOGOUT
// ========================================

function logoutAdmin() {

  localStorage.removeItem("adminLoggedIn");

  window.location.href = "index.html";
}


// ========================================
// SEARCH CUSTOMER
// ========================================

async function searchCustomer() {

  const searchElement = document.getElementById("search");
  const resultElement = document.getElementById("result");

  if (!searchElement || !resultElement) {
    return;
  }

  const mobile = searchElement.value.trim();

  if (!/^[0-9]{10}$/.test(mobile)) {

    resultElement.innerHTML =
      "<p>Please enter a valid 10 digit mobile number.</p>";

    return;
  }

  resultElement.innerHTML = "<p>Searching...</p>";

  try {

    const customerRef = doc(db, "customers", mobile);

    const snapshot = await getDoc(customerRef);

    if (!snapshot.exists()) {

      resultElement.innerHTML =
        "<div class='not-found'>" +
        "<h3>Customer Not Found</h3>" +
        "<p>No customer registered with this number.</p>" +
        "</div>";

      return;
    }

    const data = snapshot.data();

    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerMobile", data.mobile);
    localStorage.setItem("customerStamps", data.stamps || 0);

    resultElement.innerHTML = `

      <div class="customer-result">

        <h2>${escapeHtml(data.name)}</h2>

        <p>📱 ${escapeHtml(data.mobile)}</p>

        <div class="stamp-count">
          🌹 ${data.stamps || 0} / 10 Stamps
        </div>

        <div class="admin-buttons">

          <button onclick="addStamp('${data.mobile}')">
            ➕ Add Stamp
          </button>

          <button onclick="removeStamp('${data.mobile}')">
            ➖ Remove Stamp
          </button>

        </div>

        <button class="view-card"
                onclick="window.location.href='card.html'">
          View Customer Card
        </button>

      </div>

    `;

  } catch (error) {

    console.error("Search Error:", error);

    resultElement.innerHTML =
      "<p class='error'>Error: " +
      escapeHtml(error.message) +
      "</p>";
  }
}


// ========================================
// ADD STAMP
// ========================================

async function addStamp(mobile) {

  try {

    const customerRef = doc(db, "customers", mobile);

    const snapshot = await getDoc(customerRef);

    if (!snapshot.exists()) {

      alert("Customer not found.");
      return;
    }

    const data = snapshot.data();

    let stamps = Number(data.stamps || 0);

    if (stamps >= 10) {

      alert(
        "Customer already has 10 stamps! 🎉\n\n" +
        "FREE Bouquet is available."
      );

      return;
    }

    stamps++;

    await updateDoc(customerRef, {
      stamps: stamps,
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerMobile", data.mobile);
    localStorage.setItem("customerStamps", stamps);

    alert("Stamp Added Successfully 🌹");

    searchCustomer();

  } catch (error) {

    alert(
      "Could not add stamp.\n\n" +
      error.message
    );
  }
}


// ========================================
// REMOVE STAMP
// ========================================

async function removeStamp(mobile) {

  try {

    const customerRef = doc(db, "customers", mobile);

    const snapshot = await getDoc(customerRef);

    if (!snapshot.exists()) {

      alert("Customer not found.");
      return;
    }

    const data = snapshot.data();

    let stamps = Number(data.stamps || 0);

    if (stamps <= 0) {

      alert("Customer has 0 stamps.");
      return;
    }

    stamps--;

    await updateDoc(customerRef, {
      stamps: stamps,
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerMobile", data.mobile);
    localStorage.setItem("customerStamps", stamps);

    alert("Stamp Removed.");

    searchCustomer();

  } catch (error) {

    alert(
      "Could not remove stamp.\n\n" +
      error.message
    );
  }
}


// ========================================
// LOAD CUSTOMER CARD
// ========================================

async function loadCustomerCard() {

  const nameElement = document.getElementById("customerName");
  const mobileElement = document.getElementById("customerMobile");
  const stampElement = document.getElementById("stampText");

  if (!nameElement || !mobileElement || !stampElement) {
    return;
  }

  const mobile = localStorage.getItem("customerMobile");

  if (!mobile) {

    nameElement.innerText = "Customer";
    mobileElement.innerText = "";
    stampElement.innerText = "🌹 0 / 10 Stamps";

    return;
  }

  try {

    const customerRef = doc(db, "customers", mobile);

    const snapshot = await getDoc(customerRef);

    if (!snapshot.exists()) {

      nameElement.innerText = "Customer Not Found";
      mobileElement.innerText = "";
      stampElement.innerText = "🌹 0 / 10 Stamps";

      return;
    }

    const data = snapshot.data();

    const stamps = Number(data.stamps || 0);

    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerMobile", data.mobile);
    localStorage.setItem("customerStamps", stamps);

    nameElement.innerText = "Welcome, " + data.name;

    mobileElement.innerText = "📱 " + data.mobile;

    stampElement.innerText =
      "🌹 " + stamps + " / 10 Stamps";

    updateStampVisual(stamps);

  } catch (error) {

    console.error(error);

    alert(
      "Unable to load customer card.\n\n" +
      error.message
    );
  }
}


// ========================================
// STAMP VISUAL
// ========================================

function updateStampVisual(stamps) {

  const container = document.getElementById("stampBoxes");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  for (let i = 1; i <= 10; i++) {

    const box = document.createElement("div");

    box.className =
      i <= stamps
        ? "stamp-box filled"
        : "stamp-box";

    box.innerHTML =
      i <= stamps ? "🌹" : i;

    container.appendChild(box);
  }
}


// ========================================
// HTML SAFETY
// ========================================

function escapeHtml(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.saveCustomer = saveCustomer;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.searchCustomer = searchCustomer;
window.addStamp = addStamp;
window.removeStamp = removeStamp;
window.loadCustomerCard = loadCustomerCard;    alert("Saved Successfully");

    localStorage.setItem("customerName",name);
    localStorage.setItem("customerMobile",mobile);
    localStorage.setItem("customerStamps","0");

    window.location.href="card.html";

} catch(e) {

    alert("ERROR");
    alert(e.code);
    alert(e.message);

}

}



// =======================
// Admin Login
// =======================

function loginAdmin(){

const pin=document.getElementById("pin").value.trim();

if(pin==="2580"){

window.location.href="dashboard.html";

}else{

alert("Wrong PIN");

}

}



// =======================
// Add Stamp
// =======================

async function addStamp(){

const mobile=localStorage.getItem("customerMobile");

const ref=doc(db,"customers",mobile);

const snap=await getDoc(ref);

if(!snap.exists()){

alert("Customer Not Found");
return;

}

let data=snap.data();

let stamps=data.stamps;

if(stamps<10){

stamps++;

await updateDoc(ref,{
stamps:stamps
});

localStorage.setItem("customerStamps",stamps);

}

alert("Stamp Added 🌹");

location.reload();

}



// =======================
// Remove Stamp
// =======================

async function removeStamp(){

const mobile=localStorage.getItem("customerMobile");

const ref=doc(db,"customers",mobile);

const snap=await getDoc(ref);

if(!snap.exists()){

alert("Customer Not Found");
return;

}

let data=snap.data();

let stamps=data.stamps;

if(stamps>0){

stamps--;

await updateDoc(ref,{
stamps:stamps
});

localStorage.setItem("customerStamps",stamps);

}

alert("Stamp Removed");

location.reload();

}



// =======================
// Search Customer
// =======================

async function searchCustomer(){

const mobile=document.getElementById("search").value.trim();

const snap=await getDoc(doc(db,"customers",mobile));

if(snap.exists()){

const data=snap.data();

localStorage.setItem("customerName",data.name);
localStorage.setItem("customerMobile",data.mobile);
localStorage.setItem("customerStamps",data.stamps);

document.getElementById("result").innerHTML=

"<h3>"+data.name+"</h3>"+

"<p>"+data.mobile+"</p>"+

"<p>🌹 "+data.stamps+" / 10</p>";

}else{

document.getElementById("result").innerHTML=

"<h3>Customer Not Found</h3>";

}

}



// =======================
// Logout
// =======================

function logoutAdmin(){

window.location.href="index.html";

}



// Global

window.saveCustomer=saveCustomer;
window.loginAdmin=loginAdmin;
window.addStamp=addStamp;
window.removeStamp=removeStamp;
window.searchCustomer=searchCustomer;
window.logoutAdmin=logoutAdmin;
