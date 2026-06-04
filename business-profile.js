const affiliations =
  JSON.parse(
    localStorage.getItem(
      "profileAffiliation"
    ) || "[]"
  );

profileAffiliationDisplay.textContent =
  affiliations.join(" • ");
