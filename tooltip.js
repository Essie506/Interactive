const tooltipTriggers =
  document.querySelectorAll(
    ".tooltip-trigger"
  );

tooltipTriggers.forEach(trigger => {

  trigger.addEventListener(
    "click",
    e => {


         e.preventDefault();
      e.stopPropagation();

      
      const wrapper =
        trigger.closest(".tooltip-wrapper");

      const tooltip =
        trigger.nextElementSibling;

      const isOpen =
        tooltip?.classList.contains(
          "show"
        );

      document
        .querySelectorAll(
          ".tooltip-content"
        )
        .forEach(t =>
          t.classList.remove("show")
        );

      if (!isOpen) {
        tooltip?.classList.add("show");
      }

    }
  );

});

document.addEventListener(
  "click",
  e => {


      document
        .querySelectorAll(
          ".tooltip-content"
        )
        .forEach(t =>
          t.classList.remove("show")
        );


  }
);
