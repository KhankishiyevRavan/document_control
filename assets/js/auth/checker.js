import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsCeqm3FPjrjUHsuvanba-9Urg2FZ5F2I",
    authDomain: "document-control-nd.firebaseapp.com",
    projectId: "document-control-nd",
    storageBucket: "document-control-nd.appspot.com",
    messagingSenderId: "851748835904",
    appId: "1:851748835904:web:fcee220f43d3e667d645a5",
    measurementId: "G-JMX7VLXYF3",
    databaseURL:
      "https://document-control-nd-default-rtdb.europe-west1.firebasedatabase.app/",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Kullanıcı giriş durumu kontrolü
onAuthStateChanged(auth, (user) => {
  console.log(user);
  if (!user) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    if (window.location.pathname !== "/assets/pages/login.html") {
      window.location.href = "/assets/pages/login.html";
    }
  } else {
    // Kullanıcı giriş yapmışsa ve login sayfasındaysa, ana sayfaya yönlendir
    if (window.location.pathname === "/assets/pages/login.html") {
      window.location.href = "/index.html";
    }
  }
});
