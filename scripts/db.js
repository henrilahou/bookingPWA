// Documentatie over Firestore: https://firebase.google.com/docs/firestore/quickstart.
// Vanaf versie 9 wordt gewerkt met JavaScript Modules. Voor info over JS Modules, zie: 
// zie: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules.

// Import the functions you need from the SDKs you need.
// Gebruik de CDN-versie (in plaats van via npm Firebase te installeren).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Toevoegen voor gebruik Firestore.
// Add SDKs for Firebase products that you want to use.
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Extra functies ophalen voor later gebruik.
import { collection, getDocs, onSnapshot, query, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration.
// Kan je opvragen bij 'project setting' in de https://console.firebase.google.com/.
const firebaseConfig = {
    apiKey: "AIzaSyDP2g-iE3CndEREJH-lrgmn4GxOZAc-IEo",
    authDomain: "wa24-429f2.firebaseapp.com",
    databaseURL: "https://wa24-429f2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wa24-429f2",
    storageBucket: "wa24-429f2.appspot.com",
    messagingSenderId: "1081859041515",
    appId: "1:1081859041515:web:8c1d383ff78d4a74c736ae"
};

// Initialize Firebase.
const app = initializeApp(firebaseConfig);

// Maak hier een link naar de Firestore database.
const db = getFirestore(app);

// Alle reeds bestaande info opvragen in en de app zetten.
// Meer info: https://firebase.google.com/docs/firestore/quickstart#web-version-9_2
// EN
// https://firebase.google.com/docs/firestore/query-data/get-data 
// of 
// https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
//
// OPM: wil je later een nieuwe connector toevoegen in de Cloud Firestore? Gebruik dan volgende structuur:
// document => name
//          => application
//          => image
// Data ophalen? Ofwel roep je een method op om de laaste versie van de data te onvangen, ofwel
// zet je een listener die data veranderingen opvangt (snapshots).
// Zie: https://firebase.google.com/docs/firestore/query-data/listen.

// // Versie 1: een method gebruiken om de data op te vragen.
// const querySnapshot = await getDocs(collection(db, "connectors"));
// querySnapshot.forEach((doc) => {
//     console.log("Firestor doc:", doc.data());

//     // addConnectorToUI() is beschreven in myscript.js.
//     addConnectorToUI(doc.data(), doc.id);
// });

// Versie 2: bij verandering in Firestore, dat opvolgen (real time listener).
// Stel een query op die alle elementen in de collection opvraagt. Daarvan de snapshots opvolgen...
// Op die manier kan je de UI en DB in sync houden...
// Voeg maar eens een item toe via de het web portaal van Firestore. De data zou automatisch op de 
// Pinout App moeten komen. Verwijderen komt pas in volgende versie aan bod. Je kan het wel al 
// demonstreren via de Firebase console.
const unsubscribe = onSnapshot(query(collection(db, "connectors")), (querySnapshot) => {
    // // Versie 2A: eerst alle info wissen in de UI en dan alles terug opbouwen.
    // // Eerst alle data wissen.
    // clearConnectorUI();

    // // De gevonden connectoren overlopen en tonen.
    // querySnapshot.forEach((doc) => {
    //     console.log("Firestor doc:", doc.data());
    
    //     // addConnectorToUI() is beschreven in myscript.js.
    //     addConnectorToUI(doc.data(), doc.id);
    // });

    // Versie 2B: beste optie! Enkel de gewiste documenten verwijderen en de toegevoegde toevoegen.
    querySnapshot.docChanges().forEach((change) => {
        if(change.type === "added")
        {
            // addConnectorToUI() is beschreven in myscript.js.
            addConnectorToUI(change.doc.data(), change.doc.id);
            console.log("Firestore document added:", change.doc.data());
        }

        if(change.type === "removed")
        {
            // deleteConnectorFromUI() is beschreven in myscript.js.
            deleteConnectorFromUI(change.doc.id);
            console.log("Firestore document removed:", change.doc.id);
        }

        if(change.type === "modified")
        {
            console.log("'modified' not implemented yet.");
        }
    });
});

// Nieuwe connector toevoegen.
const form = document.querySelector("#frmAddConnector");
// LET OP: maak deze functie async!!!! Om te kunnen await'n.
form.addEventListener('submit', async function(event){
    //console.log(form);
    // Vermijden dat het form zomaar verstuurd wordt.
    event.preventDefault();
    console.log("Send form to add new connector.");

    // Nieuwe connector toevoegen, structuur:
    // document => name
    //          => image
    //          => description
    const connector = {
        name: form.name.value,
        image: form.image.value,
        application: form.application.value
    };

    console.log(connector);
    // Velden legen.
    form.name.value = "";
    form.image.value = "";
    form.application.value = "";

    // Info over data toevoegen: https://firebase.google.com/docs/firestore/quickstart#add_data.
    // UI wordt automatisch geüpdatet omdat je hogerop het snapshot opvolgt...
    const docRef = await addDoc(collection(db, "connectors"), connector);
    console.log("Added connector to Firestore with ID: ", docRef.id);
});

// OPM: connectors is reeds gedeclareerd in myscript.js.
// Gebruik één overkoepelende click event handler.
connectors.addEventListener('click', async function(event){
    // Zoek naar 'target'->'tagName'. Indien van type 'i', dan werd op het vuilbakje geklikt.
    console.log(event);
    if(event.target.tagName === 'I')
    {
        console.log("Delete connector.");
        const id = event.target.getAttribute('data-id');

        // Zoek het 'document' op met een bepaald ID.
        const document = doc(db, "connectors", id);

        // Het document effectief verwijderen.
        deleteDoc(document)
            .then(() => console.log("Item deleted."));
    }
});