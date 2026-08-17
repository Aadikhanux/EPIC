/**
 * EPIC Portal — Firebase Configuration
 */
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyCB0fcdKrkIlZrMCABJ25hMf10rOnuAoRA",
    authDomain: "epic-3b86d.firebaseapp.com",
    databaseURL: "https://epic-3b86d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "epic-3b86d",
    storageBucket: "epic-3b86d.firebasestorage.app",
    messagingSenderId: "967093540543",
    appId: "1:967093540543:web:e4a0839d9f8a86fc13180a"
};

window.FIREBASE_DB_URL = localStorage.getItem('epic_firebase_db_url') || window.FIREBASE_CONFIG.databaseURL;
