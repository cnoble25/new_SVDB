import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyBVDRI-vHvyCDbCuKXuP3ZW-N4fCBWCrfA",
    authDomain: "svdb-26aa4.firebaseapp.com",
    projectId: "svdb-26aa4",
    storageBucket: "svdb-26aa4.firebasestorage.app",
    messagingSenderId: "313187978669",
    appId: "1:313187978669:web:46f20653eeddacceda6524",
    measurementId: "G-ZN3CK679B4"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

async function addData(db) {
    try {
        const docRef = await addDoc(collection(db, "Art"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



//ONLY RUN IF THE DATABASE IS SCREWED
export async function clearDatabase () {
    const studentPieces = await getDocs(collection(db, "Art"));
    studentPieces.forEach((piece) =>{
        deleteDoc(doc(db, "Art", piece.id));
    } );
}


//makes it so you can add csv data to a database
export async function importCSVToDatabase () {

    const studentPieces = await getDocs(collection(db, "Art"));
    studentPieces.forEach((piece) =>{
        deleteDoc(doc(db, "Art", piece.id));
    } );
    // try{
    var file = document.getElementById("URL").files[0];
    var reader = new FileReader();
    var makeSure = prompt("please enter the name of the file to upload the file to the database");
    if(makeSure != file.innerHTML){
        reader.onload = function(event) {
            var csvData = event.target.result;
            var rows = csvData.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].split(",");
                try {
                            const docRef = addDoc(collection(db, "Art"), {
                                Name: cells[2] + " " + cells[1].substring(0,1),
                                Year: cells[3],
                                Class: cells[4],
                                Campus: cells[6].toUpperCase(),
                                Building: cells[7].toUpperCase(),
                                Room: cells[8],
                                Picture:"NO"
                            });
                            console.log("Document written with ID: ", docRef.id);

                }
                catch (e) {
                    console.log(cells);
                    console.error("Error adding student to database: ", e);
                    alert("file not uploaded for safety")
                }

            }
        };
        reader.readAsText(file);
        file.innerHTML = null;

    }else{
        console.log(file.innerHTML);
        alert("file not uploaded for safety")
    }
}

//separates a room number into its building, floor and campus
//NOT USED ANYMORE


//doesn't do anything anymore
function getPaintingCampus(painting){
    if(painting.campus.toUpperCase() == "Upper School"){
        return 2;
    }else if (painting.campus.toUpperCase() == "Lower School"){
        return 1;
    }else {
        return -1;
    }
}

//poosition can only be accessed asyncronesly so to find someones position in accordance to the buildings would be
//doesn't do anything anymore
function makeImageUsable(imgURL){
    return imgURL;
}
//Used to Make the Campuses in the database fit with the Campuses
//used for the geolocation api because the sheet takes in campuses
//as GR and BEL for US and LS respectively
function makeCampus(thing){
    if(thing.toUpperCase() == "BEL"){
        return "Lower School";
    }
    if(thing.toUpperCase() == "GR"){
        return "Upper School";
    }
}