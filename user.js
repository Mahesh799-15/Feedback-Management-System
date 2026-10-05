const me = guard("user");
const $ = id => document.getElementById(id);
let rating = 0;

$("hello").textContent = "Hi, " + me.name;
$("restaurant").innerHTML = RESTAURANTS.map(r => `<option>${r.name}</option>`).join("");
$("category").innerHTML = CATEGORIES.map(c => `<option>${c}</option>`).join("");

// Star selector
$("stars").innerHTML = [1, 2, 3, 4, 5].map(n => `<span data-v="${n}">★</span>`).join("");
$("stars").onclick = e => {
  if (!e.target.dataset.v) return;
  rating = Number(e.target.dataset.v);
  [...$("stars").children].forEach((s, i) => s.classList.toggle("on", i < rating));
};

function render() {
  const all = get("feedbacks", []);

  // Restaurant cards with average rating
  $("restList").innerHTML = RESTAURANTS.map(r => {
    const list = all.filter(f => f.restaurant === r.name);
    return `<div class="card rest">
      <div class="icon">${r.icon}</div>
      <b>${r.name}</b>
      <p style="color:var(--muted)">${r.cuisine}</p>
      <p class="rate">★ ${avg(list)} <small>(${list.length})</small></p>
      <button class="ghost" onclick="pick('${r.name}')">Rate this</button>
    </div>`;
  }).join("");

  // Only this user's feedback
  const mine = all.filter(f => f.email === me.email).reverse();
  $("myList").innerHTML = mine.length ? mine.map(f => `
    <div class="card fb">
      <div class="fb-head"><b>${f.restaurant}</b><span class="tag ${f.status}">${f.status}</span></div>
      <p class="rate">${stars(f.rating)}</p>
      <p><span class="tag">${f.category}</span> ${esc(f.comment)}</p>
      <small style="color:var(--muted)">${f.date}</small>
      ${f.reply ? `<div class="reply"><b>Restaurant reply:</b> ${esc(f.reply)}</div>` : ""}
    </div>`).join("") : `<p style="color:var(--muted)">No feedback yet. Pick a restaurant and rate your last meal.</p>`;
}

function pick(name) {
  $("restaurant").value = name;
  $("restaurant").scrollIntoView({ behavior: "smooth", block: "center" });
}

$("submitBtn").onclick = () => {
  const comment = $("comment").value.trim();
  if (!rating) return showMsg("Please select a star rating.");
  if (!comment) return showMsg("Please write a comment.");

  const all = get("feedbacks", []);
  all.push({
    id: Date.now(),
    email: me.email,
    user: me.name,
    restaurant: $("restaurant").value,
    category: $("category").value,
    rating,
    comment,
    date: new Date().toLocaleDateString(),
    status: "Pending",
    reply: ""
  });
  set("feedbacks", all);

  $("comment").value = "";
  rating = 0;
  [...$("stars").children].forEach(s => s.classList.remove("on"));
  showMsg("Thank you! Your feedback was submitted.", true);
  render();
};

function showMsg(text, ok) {
  $("msg").textContent = text;
  $("msg").className = ok ? "msg ok" : "msg";
}

render();