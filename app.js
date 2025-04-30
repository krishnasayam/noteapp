// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH_xoDp3Bu1cykMxOgsaQfF35Awr6EpCU",
  authDomain: "cloud-notes-app-52eaa.firebaseapp.com",
  projectId: "cloud-notes-app-52eaa",
  storageBucket: "cloud-notes-app-52eaa.firebasestorage.app",
  messagingSenderId: "1013702062777",
  appId: "1:1013702062777:web:4a05c27c0a04f51cf2a168",
  measurementId: "G-G5GC7H8CBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const userNameDisplay = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const authContainer = document.getElementById('auth-container');
const notesContainer = document.getElementById('notes-container');
const noteInput = document.getElementById('note-input');
const saveNoteBtn = document.getElementById('save-note-btn');
const notesList = document.getElementById('notes-list');

// Authentication
auth.onAuthStateChanged(user => {
    if (user) {
        userNameDisplay.textContent = `Welcome, ${user.email}`;
        logoutBtn.style.display = 'block';
        authContainer.style.display = 'none';
        notesContainer.style.display = 'block';
        loadNotes();
    } else {
        userNameDisplay.textContent = '';
        logoutBtn.style.display = 'none';
        authContainer.style.display = 'block';
        notesContainer.style.display = 'none';
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Login functionality
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => console.error('Error logging in:', error));
});

// Registration functionality
document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .catch(error => console.error('Error registering:', error));
});

// Save note functionality
saveNoteBtn.addEventListener('click', () => {
    const noteText = noteInput.value;
    if (noteText) {
        db.collection('notes').add({
            text: noteText,
            userId: auth.currentUser .uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            noteInput.value = '';
            loadNotes();
        }).catch(error => console.error('Error saving note:', error));
    }
});

// Load notes from Firestore
function loadNotes() {
    notesList.innerHTML = '';
    db.collection('notes').where('userId', '==', auth.currentUser .uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = doc.data().text;
                notesList.appendChild(li);
            });
        });
} 