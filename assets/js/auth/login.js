import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

import {
  getAuth,
  signInWithEmailAndPassword,
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

const email = document.querySelector("#email");

const password = document.querySelector("input[type=password]");

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth();


const btn = document.querySelector("#login");

function login(e) {
  e.preventDefault();
  var obj = {
    email: email.value,
    password: password.value,
  };
  console.log(obj);
  signInWithEmailAndPassword(auth, obj.email, obj.password)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

btn.addEventListener("click", login);


