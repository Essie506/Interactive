const tooltipTriggers =
  document.querySelectorAll(
    ".tooltip-trigger"
  );

const tooltip =
  trigger.nextElementSibling;

const isOpen =
  tooltip?.classList.contains(
    "show"
  );



tooltipTriggers.forEach(trigger => {

  trigger.addEventListener(
    "click",
    () => {

      document
        .querySelectorAll(".tooltip-content")
        .forEach(t =>
          t.classList.remove("show")
        );

      trigger.nextElementSibling
        ?.classList.add("show");

    }
  );

});

document.addEventListener(
  "click",
  e => {

   if (!e.target.closest(".tooltip-wrapper"))
  
  
document
  .querySelectorAll(".tooltip-content")
  .forEach(t =>
    t.classList.remove("show")
  );

if (!isOpen) {
  tooltip?.classList.add("show");
}

  }
);
