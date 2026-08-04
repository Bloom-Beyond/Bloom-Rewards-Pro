// ============================
// Bloom Rewards Pro
// script.js
// ============================

import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================
// Customer Registration
// ============================

async function saveCustomer() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    if(name==="" || mobile===""){
        alert("Please fill all details");
        return;
    }

    try{

        await setDoc(doc(db,"customers",mobile),{
            name,
            mobile,
            stamps:0,
            createdAt:new Date().toISOString()
        });

        localStorage.setItem("customerName",name);
        localStorage.setItem("customerMobile",mobile);
        localStorage.setItem("customerStamps","0");

        alert("Customer Registered Successfully 🌸");

        window.location.href="card.html";

    }catch(error){

        alert(error.message);

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

async function addStamp(){

    const mobile=localStorage.getItem("customerMobile");

    const ref=doc(db,"customers",mobile);

    const snap=await getDoc(ref);

    if(!snap.exists()){
        alert("Customer not found");
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


// ============================
// Remove Stamp
// ============================

async function removeStamp(){

    const mobile=localStorage.getItem("customerMobile");

    const ref=doc(db,"customers",mobile);

    const snap=await getDoc(ref);

    if(!snap.exists()){
        alert("Customer not found");
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


// ============================
// Search Customer
// ============================

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
        "<p>🌹 "+data.stamps+" / 10</p>";

    }else{

        document.getElementById("result").innerHTML=
        "<h3>Customer Not Found</h3>";

    }

}


// ============================
// Logout
// ============================

function logoutAdmin(){

    window.location.href="index.html";

}


// ============================
// Global Functions
// ============================

window.saveCustomer=saveCustomer;
window.loginAdmin=loginAdmin;
window.addStamp=addStamp;
window.removeStamp=removeStamp;
window.searchCustomer=searchCustomer;
window.logoutAdmin=logoutAdmin;
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
