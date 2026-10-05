// Shared helpers used by every page

// ===== SET YOUR OWN ADMIN LOGIN HERE =====
const ADMIN_EMAIL = "venkatamahesh@gmail.com";
const ADMIN_PASSWORD = "Feedback@123";
// =========================================

const RESTAURANTS = [
  { name: "Spice Garden", cuisine: "Indian", icon: "🍛" },
  { name: "Pizza Palace", cuisine: "Italian", icon: "🍕" },
  { name: "Dragon Wok", cuisine: "Chinese", icon: "🥡" },
  { name: "Burger Barn", cuisine: "Fast Food", icon: "🍔" },
  { name: "Sushi Zen", cuisine: "Japanese", icon: "🍣" },
  { name: "Sweet Tooth", cuisine: "Desserts", icon: "🍰" }
];
const CATEGORIES = ["Food Quality", "Service", "Ambience", "Cleanliness", "Price", "Suggestion"];

// Local Storage helpers
const get = (key, fallback) => JSON.parse(localStorage.getItem(key)) || fallback;
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Keep exactly one admin account, using the credentials above.
// This also removes any old admin (including the earlier demo one) saved in the browser.
const users = get("users", []).filter(u => u.role !== "admin" && u.email !== ADMIN_EMAIL);
users.push({ name: "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
set("users", users);

// If someone is still logged in as an old admin, log them out
const currentSession = get("session", null);
if (currentSession && currentSession.role === "admin" && currentSession.email !== ADMIN_EMAIL) {
  localStorage.removeItem("session");
}

// Page protection + role based redirection
function guard(role) {
  const user = get("session", null);
  if (!user) { location.href = "index.html"; throw new Error("redirect"); }
  if (user.role !== role) {
    location.href = user.role === "admin" ? "admin.html" : "user.html";
    throw new Error("redirect");
  }
  return user;
}

function logout() {
  localStorage.removeItem("session");
  location.href = "index.html";
}

const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const avg = list => list.length ? (list.reduce((t, f) => t + f.rating, 0) / list.length).toFixed(1) : "–";