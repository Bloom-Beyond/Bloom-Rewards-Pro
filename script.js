import { db } from "./firebase.js";

import {
doc,
setDoc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// =======================
// Register Customer
// =======================

async function saveCustomer(){
alert("Function Started");
const name=document.getElementById("name").value.trim();
const mobile=document.getElementById("mobile").value.trim();

if(name==="" || mobile===""){
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

window.location.href="card.html";

}catch(e){

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
