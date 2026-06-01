const tooltipTriggers =
  document.querySelectorAll(
    ".tooltip-trigger"
  );

tooltipTriggers.forEach(...);



document
  .querySelectorAll(".tooltip-trigger")
  .forEach(trigger => {

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
  
    
    {

      document
        .querySelectorAll(".tooltip-content")
        .forEach(t =>
          t.classList.remove("show")
        );

    }

  }
);
