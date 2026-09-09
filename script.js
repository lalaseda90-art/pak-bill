const companies = [
  {id:"iesco", name:"IESCO", full:"Islamabad Electric Supply Company", area:"Islamabad / Rawalpindi", slug:"iescobill"},
  {id:"fesco", name:"FESCO", full:"Faisalabad Electric Supply Company", area:"Faisalabad", slug:"fescobill"},
  {id:"lesco", name:"LESCO", full:"Lahore Electric Supply Company", area:"Lahore", slug:"lescobill"},
  {id:"gepco", name:"GEPCO", full:"Gujranwala Electric Power Company", area:"Gujranwala", slug:"gepcobill"},
  {id:"mepco", name:"MEPCO", full:"Multan Electric Power Company", area:"Multan / South Punjab", slug:"mepcobill"},
  {id:"pesco", name:"PESCO", full:"Peshawar Electric Supply Company", area:"Peshawar / KPK", slug:"pescobill"},
  {id:"hesco", name:"HESCO", full:"Hyderabad Electric Supply Company", area:"Hyderabad / Lower Sindh", slug:"hescobill"},
  {id:"sepco", name:"SEPCO", full:"Sukkur Electric Power Company", area:"Sukkur / Upper Sindh", slug:"sepcobill"},
  {id:"qesco", name:"QESCO", full:"Quetta Electric Supply Company", area:"Quetta / Balochistan", slug:"qescobill"},
  {id:"tesco", name:"TESCO", full:"Tribal Areas Electric Supply Company", area:"Tribal districts", slug:"tescobill"},
  {id:"hazeco", name:"HAZECO", full:"Hazara Electric Supply Company", area:"Hazara / Abbottabad", slug:"hazecobill"}
];

const companySelect = document.querySelector("#company");
const companyGrid = document.querySelector("#companyGrid");
const input = document.querySelector("#billNumber");
const label = document.querySelector("#numberLabel");
const count = document.querySelector("#count");
const message = document.querySelector("#message");
const saveNumber = document.querySelector("#saveNumber");
const recentBox = document.querySelector("#recentBox");
const recentButton = document.querySelector("#recentButton");
let mode = "reference";

companies.forEach(c => {
  const option = document.createElement("option");
  option.value = c.id;
  option.textContent = `${c.name} — ${c.area}`;
  companySelect.appendChild(option);

  const card = document.createElement("a");
  card.className = "company-card";
  card.href = "#home";
  card.dataset.company = c.id;
  card.innerHTML = `<div class="company-icon">${c.name.slice(0,2)}</div><div><h3>${c.name}</h3><p>${c.area}</p></div>`;
  card.addEventListener("click", e => {
    e.preventDefault();
    companySelect.value = c.id;
    document.querySelector("#home").scrollIntoView({behavior:"smooth"});
    input.focus();
  });
  companyGrid.appendChild(card);
});

function setMode(next) {
  mode = next;
  document.querySelectorAll(".mode").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === next));
  if (next === "reference") {
    label.textContent = "14 Digit Reference Number";
    input.maxLength = 14;
    input.placeholder = "Enter 14 Digit Reference No.";
    count.textContent = `${input.value.length} / 14`;
  } else {
    label.textContent = "Customer ID";
    input.maxLength = 12;
    input.placeholder = "Enter Customer ID";
    count.textContent = `${input.value.length} / 10+`;
  }
  input.value = "";
  message.textContent = "";
}
document.querySelectorAll(".mode").forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));

input.addEventListener("input", () => {
  input.value = input.value.replace(/\D/g, "");
  count.textContent = mode === "reference" ? `${input.value.length} / 14` : `${input.value.length} / 10+`;
  message.textContent = "";
});

function getCompany() {
  return companies.find(c => c.id === companySelect.value);
}

function openBill() {
  const company = getCompany();
  const value = input.value.trim();

  if (!company) {
    message.textContent = "Please select your electricity company first.";
    companySelect.focus();
    return;
  }

  if (mode === "reference" && value.length !== 14) {
    message.textContent = "Please enter the 14-digit Reference Number.";
    input.focus();
    return;
  }

  if (mode === "customer" && value.length < 6) {
    message.textContent = "Please enter a valid Customer ID.";
    input.focus();
    return;
  }

  if (mode === "reference") {
    const url = `https://bill.pitc.com.pk/${company.slug}/general?refno=${encodeURIComponent(value)}`;
    if (saveNumber.checked) localStorage.setItem("pakBillSaved", JSON.stringify({company:company.id,value,mode}));
    window.open(url, "_blank", "noopener");
    message.textContent = "Opening the official bill portal in a new tab…";
  } else {
    // PITC company pages support Customer ID selection, but parameter formats can differ.
    // Open the official company page so the user can choose Customer ID there.
    const url = `https://bill.pitc.com.pk/${company.slug}/general`;
    if (saveNumber.checked) localStorage.setItem("pakBillSaved", JSON.stringify({company:company.id,value,mode}));
    window.open(url, "_blank", "noopener");
    message.textContent = "Opening the official company bill page. Select Customer ID and enter your number there.";
  }
}

document.querySelector("#checkBill").addEventListener("click", openBill);
input.addEventListener("keydown", e => { if (e.key === "Enter") openBill(); });

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem("pakBillSaved") || "null");
    if (!saved) return;
    const company = companies.find(c => c.id === saved.company);
    if (!company) return;
    recentBox.hidden = false;
    recentButton.textContent = `${company.name} • ${saved.value}`;
    recentButton.onclick = () => {
      companySelect.value = saved.company;
      mode = saved.mode;
      setMode(saved.mode);
      input.value = saved.value;
      count.textContent = saved.mode === "reference" ? `${saved.value.length} / 14` : `${saved.value.length} / 10+`;
    };
  } catch {}
}
loadSaved();

document.querySelector("#calculate").addEventListener("click", () => {
  const units = Number(document.querySelector("#units").value);
  const rate = Number(document.querySelector("#rate").value);
  const estimate = document.querySelector("#estimate");
  if (!units || !rate || units < 0 || rate < 0) {
    estimate.textContent = "Enter valid units and an approximate per-unit rate.";
    return;
  }
  estimate.textContent = `Estimated energy charge: Rs. ${Math.round(units * rate).toLocaleString("en-PK")}. Taxes and other bill components are not included.`;
});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#menuToggle").addEventListener("click", () => {
  document.querySelector("#mainNav").classList.toggle("open");
});
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.querySelector("#mainNav").classList.remove("open")));
