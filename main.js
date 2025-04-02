import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// hiiii
const firebaseConfig = {
    apiKey: "AIzaSyBVDRI-vHvyCDbCuKXuP3ZW-N4fCBWCrfA",
    authDomain: "svdb-26aa4.firebaseapp.com",
    projectId: "svdb-26aa4",
    storageBucket: "svdb-26aa4.firebasestorage.app",
    messagingSenderId: "313187978669",
    appId: "1:313187978669:web:46f20653eeddacceda6524",
    measurementId: "G-ZN3CK679B4"
};

initializeApp(firebaseConfig);
const db = getFirestore();

let content = document.getElementById('Content');
let search = document.getElementById('Search');
let about = document.getElementById('About');
const initial_content = content.innerHTML;
const initial_search = search.innerHTML;
const initial_about = about.innerHTML;

async function readDatabase() {
    try {
        const collectionRef = collection(db, "Art");
        const studentPieces = await getDocs(collectionRef);

        const artData = [];
        studentPieces.forEach(item => {
            artData.push({
                Class: item.data().Class,
                Room: item.data().Room,
                Name: item.data().Name,
                Picture: item.data().Picture,
                Year: item.data().Year
            });
        });

        sessionStorage.setItem("Art", JSON.stringify(artData));
        console.log("Database read successfully.");
    } catch (error) {
        console.error("Error reading database:", error);
    }
}

readDatabase();

async function createItems(text) {
    const data = JSON.parse(sessionStorage.getItem("Art"));
    let arr = [];



    data.forEach(item => {
        if((item.Name).includes(text) || (item.Class).includes(text) || (item.Year).includes(text)){
            let itemDiv = document.createElement('div');
            let text = document.createElement('p');
            let img = document.createElement('img');
            img.src = item.Picture;
            img.onerror = function () {
                img.src = "no.png";
            };
            img.style.width = "70%";
            let location = getLocation("LS");
            text.innerHTML = "STUDENT: " + item.Name + "<br>" +
                "CLASS: " + item.Class + "<br><br>" +
                "LOCATION PROXIMITY: " + item.Room + "<br>" +
                location;
            text.style.fontSize = "2vh";
            text.style.fontFamily = "Arial, sans-serif";
            text.style.fontWeight = "bold";
            itemDiv.className = "item";
            itemDiv.appendChild(img);
            itemDiv.appendChild(text);
            itemDiv.style.height = "100%";
            itemDiv.style.width = "100%";
            itemDiv.style.scrollSnapAlign = "start";
            itemDiv.style.overflow = "hidden";
            arr.push(itemDiv);
        }
        });
        return arr;
}

export async function Search(text) {
    about.style.display = "none";
    content.innerHTML = "";
    search.style.position = "absolute";
    search.style.marginBottom = "3vh";
    search.style.bottom = "0";
    search.style.transition = "bottom 2s";
    search.style.left = "50vw";
    search.style.transform = "translate(-50%, 0)";
    search.style.transitionBehavior = "allow-discrete";

    let SVDB_image = document.createElement('img');
    SVDB_image.src = "SVDB.jpg";
    SVDB_image.style.width = "30vw";
    SVDB_image.style.marginTop = "3vh";
    content.appendChild(SVDB_image);
    content.align = "center";


    let items = document.createElement('div');
    items.id = "Items";
    items.style.overflowY = "scroll";
    items.style.overflowX = "hidden";
    items.style.width = "85vw";
    items.style.height = "70vh";
    items.style.scrollSnapType = "y mandatory";

    let arr = await createItems(text);
    arr.forEach(item => {
        items.appendChild(item);
    });


    content.appendChild(items);
}

async function getLocation(Campus){

    await navigator.geolocation.getCurrentPosition( successCallback, errorCallback);
    let latitude =  sessionStorage.getItem("Latitude");
    let longitude =  sessionStorage.getItem("Longitude");
    //current campus is just to tell which campus the person is on 1 means lower school 2 means highschool
    let currentCampus = null;
    if(latitude > 38.05 && longitude < -78.518){
        currentCampus = "LS";
    }else if(latitude < 38.05 && longitude > -78.518){
        currentCampus = "US";
    }
    if(currentCampus == Campus) {
        return "YOU ARE ON THE RIGHT CAMPUS";
    }else{
        return "YOU ARE NOT ON THE RIGHT CAMPUS";
    }

}

function successCallback(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    longitude = longitude.toPrecision(5);
    latitude = latitude.toPrecision(5);
    sessionStorage.setItem("Latitude", latitude);
    sessionStorage.setItem("Longitude", longitude);
}
function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("User denied the request for geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
    }
}
