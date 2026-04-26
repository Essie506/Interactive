// =========================
// SUGGEST NEW FILTER
// =========================

function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const extraServiceInput = document.getElementById("extraServiceInput");
const suggestServiceBtn = document.getElementById("suggestServiceBtn");

if (suggestServiceBtn && extraServiceInput) {
  suggestServiceBtn.addEventListener("click", async () => {
    const label = extraServiceInput.value.trim();
    if (!label) return;

    // TEMP: just log (until Firebase wired)
    console.log("Suggested:", label, makeSlug(label));

    // LATER: send to Firestore here

    extraServiceInput.value = "";
  });
}
