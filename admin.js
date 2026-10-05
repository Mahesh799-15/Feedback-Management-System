const admin = guard("admin");
const $ = id => document.getElementById(id);

$("hello").textContent = "Hi, " + admin.name;
$("fRest").innerHTML = `<option value="">All restaurants</option>` + RESTAURANTS.map(r => `<option>${r.name}</option>`).join("");
$("fCat").innerHTML = `<option value="">All categories</option>` + CATEGORIES.map(c => `<option>${c}</option>`).join("");
["fRest", "fCat", "fStatus"].forEach(id => $(id).onchange = render);

function render() {
  const all = get("feedbacks", []);

  // Summary cards
  const totalUsers = get("users", []).filter(u => u.role === "user").length;
  $("stats").innerHTML = [
    ["Total feedback", all.length],
    ["Average rating", avg(all)],
    ["Pending", all.filter(f => f.status === "Pending").length],
    ["Resolved", all.filter(f => f.status === "Resolved").length],
    ["Users", totalUsers]
  ].map(s => `<div class="card stat"><b>${s[1]}</b>${s[0]}</div>`).join("");

  // Rating breakdown bars (5 star down to 1 star)
  $("bars").innerHTML = [5, 4, 3, 2, 1].map(n => {
    const count = all.filter(f => f.rating === n).length;
    const pct = all.length ? (count / all.length) * 100 : 0;
    return `<div class="bar"><span style="width:40px">${n} ★</span><i style="width:${pct}%;min-width:4px"></i><span>${count}</span></div>`;
  }).join("");

  // Apply filters
  const r = $("fRest").value, c = $("fCat").value, s = $("fStatus").value;
  const shown = all.filter(f => (!r || f.restaurant === r) && (!c || f.category === c) && (!s || f.status === s)).reverse();

  $("list").innerHTML = shown.length ? shown.map(f => `
    <div class="card fb">
      <div class="fb-head"><b>${f.restaurant}</b><span class="tag ${f.status}">${f.status}</span></div>
      <p class="rate">${stars(f.rating)}</p>
      <p><span class="tag">${f.category}</span> ${esc(f.comment)}</p>
      <small style="color:var(--muted)">by ${esc(f.user)} on ${f.date}</small>
      ${f.reply ? `<div class="reply"><b>Your reply:</b> ${esc(f.reply)}</div>` : ""}
      <input id="r${f.id}" placeholder="Write a reply..." style="margin-top:10px">
      <button class="gold" onclick="replyFeedback(${f.id})">Send reply</button>
      <button class="ghost" onclick="toggleStatus(${f.id})">Mark ${f.status === "Pending" ? "resolved" : "pending"}</button>
      <button class="ghost" onclick="deleteFeedback(${f.id})">Delete</button>
    </div>`).join("") : `<p style="color:var(--muted)">No feedback matches these filters.</p>`;
}

function update(id, change) {
  const all = get("feedbacks", []).map(f => f.id === id ? { ...f, ...change } : f);
  set("feedbacks", all);
  render();
}

function replyFeedback(id) {
  const text = $("r" + id).value.trim();
  if (!text) return alert("Please write a reply first.");
  update(id, { reply: text, status: "Resolved" });
}

function toggleStatus(id) {
  const f = get("feedbacks", []).find(x => x.id === id);
  update(id, { status: f.status === "Pending" ? "Resolved" : "Pending" });
}

function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;
  set("feedbacks", get("feedbacks", []).filter(f => f.id !== id));
  render();
}

render();