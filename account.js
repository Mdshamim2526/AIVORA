import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const el = id => document.getElementById(id);
const status = el("status");
const authPanel = el("auth-panel");
const signedIn = el("signed-in");
let mode = "login";
let auth = null;
const say = text => { status.textContent = text; };

function setMode(next) {
  mode = next;
  const signup = mode === "signup";
  el("login-tab").setAttribute("aria-selected", String(!signup));
  el("signup-tab").setAttribute("aria-selected", String(signup));
  el("name-wrap").classList.toggle("hidden", !signup);
  el("display-name").required = signup;
  el("submit-button").textContent = signup ? "অ্যাকাউন্ট তৈরি করো" : "লগইন";
  el("reset-button").classList.toggle("hidden", signup);
  say("");
}
el("login-tab").addEventListener("click", () => setMode("login"));
el("signup-tab").addEventListener("click", () => setMode("signup"));

if (Object.values(firebaseConfig).some(v => typeof v !== "string" || !v || v.startsWith("PASTE_"))) {
  say("Firebase সংযোগের জন্য firebase-config.js-এ Firebase Console-এর Web App config বসাতে হবে। Project settings → Your apps → SDK setup and configuration → Config থেকে মানগুলো নাও।");
} else {
  try {
    auth = getAuth(initializeApp(firebaseConfig));
    onAuthStateChanged(auth, user => {
      authPanel.classList.toggle("hidden", Boolean(user));
      signedIn.classList.toggle("hidden", !user);
      if (user) el("welcome").textContent = "স্বাগতম, " + (user.displayName || user.email || "MAIRA user");
    });
  } catch (error) {
    say("Firebase চালু করা যায়নি। firebase-config.js-এর মানগুলো যাচাই করো।");
    console.error("Firebase initialization error:", error);
  }
}

el("auth-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!auth) return say("আগে firebase-config.js-এ সঠিক Firebase Web App config বসাও।");
  const email = el("email").value.trim();
  const password = el("password").value;
  const button = el("submit-button");
  button.disabled = true;
  try {
    if (mode === "signup") {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = el("display-name").value.trim();
      if (displayName) await updateProfile(credential.user, { displayName });
      say("অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      say("লগইন সফল হয়েছে।");
    }
  } catch (error) {
    const messages = {
      "auth/email-already-in-use": "এই ইমেইল দিয়ে আগে অ্যাকাউন্ট তৈরি হয়েছে। লগইন করো।",
      "auth/invalid-email": "সঠিক ইমেইল ঠিকানা দাও।",
      "auth/weak-password": "আরও শক্তিশালী পাসওয়ার্ড দাও (কমপক্ষে ৬ অক্ষর)।",
      "auth/invalid-credential": "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
      "auth/network-request-failed": "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।",
      "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।"
    };
    say(messages[error.code] || "কাজটি সম্পন্ন হয়নি। Firebase Authentication settings পরীক্ষা করো।");
    console.error("Firebase authentication error:", error.code);
  } finally {
    button.disabled = false;
  }
});

el("reset-button").addEventListener("click", async () => {
  if (!auth) return say("আগে Firebase Web App config যোগ করতে হবে।");
  const email = el("email").value.trim();
  if (!email) return say("রিসেট লিংক পাঠাতে আগে ইমেইল লিখো।");
  try {
    await sendPasswordResetEmail(auth, email);
    say("পাসওয়ার্ড রিসেটের লিংক ইমেইলে পাঠানো হয়েছে।");
  } catch (error) {
    say(error.code === "auth/invalid-email" ? "সঠিক ইমেইল ঠিকানা দাও।" : "রিসেট ইমেইল পাঠানো যায়নি।");
  }
});

el("logout-button").addEventListener("click", async () => {
  if (!auth) return;
  try { await signOut(auth); say("লগআউট হয়েছে।"); }
  catch { say("লগআউট করা যায়নি। আবার চেষ্টা করো।"); }
});
