// ============================
// Bloom Rewards Pro v1.0
// ============================

import { db } from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================
// Customer Registration
// ============================

async function saveCustomer() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    if(name === "" || mobile === ""){
        alert("Please fill all details");
        return;
    }

    try{

        await setDoc(doc(db,"customers",mobile),{

            name:name,
            mobile:mobile,
            stamps:0,
            createdAt:new Date().toISOString()

        });

        localStorage.setItem("customerName",name);
        localStorage.setItem("customerMobile",mobile);
        localStorage.setItem("customerStamps","0");

        alert("Customer Registered Successfully 🌸");

        window.location.href="card.html";

    }catch(error){

        alert("Firebase Error : " + error.message);

    }

}


// ============================
// Admin Login
// ============================

function loginAdmin(){

    const pin=document.getElementById("pin").value.trim();

    if(pin==="2580"){

        window.location.href="dashboard.html";

    }else{

        alert("Wrong Admin PIN");

    }

}


// ============================
// Add Stamp
// ============================

function addStamp(){

    let stamp=Number(localStorage.getItem("customerStamps")) || 0;

    if(stamp<10){

        stamp++;

        localStorage.setItem("customerStamps",stamp);

    }

    alert("Stamp Added 🌹");

    location.reload();

}


// ============================
// Remove Stamp
// ============================

function removeStamp(){

    let stamp=Number(localStorage.getItem("customerStamps")) || 0;

    if(stamp>0){

        stamp--;

        localStorage.setItem("customerStamps",stamp);

    }

    alert("Stamp Removed");

    location.reload();

}


// ============================
// Logout
// ============================

function logoutAdmin(){

    window.location.href="index.html";

}


// ============================
// Search Customer
// ============================

function searchCustomer(){

    const mobile=document.getElementById("search").value.trim();

    const savedMobile=localStorage.getItem("customerMobile");

    if(mobile===savedMobile){

        document.getElementById("result").innerHTML=`

            <h3>${localStorage.getItem("customerName")}</h3>

            <p>📱 ${savedMobile}</p>

            <p>🌹 ${localStorage.getItem("customerStamps")} / 10</p>

        `;

    }else{

        document.getElementById("result").innerHTML=

        "<h3>Customer Not Found</h3>";

    }

}


// ============================
// Global Functions
// ============================

window.saveCustomer=saveCustomer;
window.loginAdmin=loginAdmin;
window.addStamp=addStamp;
window.removeStamp=removeStamp;
window.logoutAdmin=logoutAdmin;
window.searchCustomer=searchCustomer;
