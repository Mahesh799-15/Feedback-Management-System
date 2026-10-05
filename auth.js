const $ = id => document.getElementById(id);

// If already logged in, go straight to the right module
const active = get("session", null);
if (active) location.href = active.role === "admin" ? "admin.html" : "user.html";

function showMsg(text, ok) {
  $("msg").textContent = text;
  $("msg").className = ok ? "msg ok" : "msg";
}

function showTab(login) {
  $("loginForm").classList.toggle("hidden", !login);
  $("signupForm").classList.toggle("hidden", login);
  $("tabLogin").classList.toggle("active", login);
  $("tabSignup").classList.toggle("active", !login);
  showMsg("");
}
$("tabLogin").onclick = () => showTab(true);
$("tabSignup").onclick = () => showTab(false);

// SIGNUP: save new user in Local Storage
$("signupBtn").onclick = () => {
  const name = $("sName").value.trim();
  const email = $("sEmail").value.trim().toLowerCase();
  const password = $("sPass").value;

  if (!name || !email || !password) return showMsg("Please fill all fields.");
  if (password.length < 6) return showMsg("Password must be at least 6 characters.");

  const list = get("users", []);
  if (list.some(u => u.email === email)) return showMsg("This email is already registered.");

  list.push({ name, email, password, role: "user" });
  set("users", list);
  showTab(true);
  showMsg("Account created! Please login.", true);
};

// LOGIN: check credentials, save session, redirect by role
$("loginBtn").onclick = () => {
  const email = $("lEmail").value.trim().toLowerCase();
  const password = $("lPass").value;
  const user = get("users", []).find(u => u.email === email && u.password === password);

  if (!user) return showMsg("Wrong email or password.");

  set("session", user);
  location.href = user.role === "admin" ? "admin.html" : "user.html";
};