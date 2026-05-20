window.addEventListener(
  "load",
  () => {


const profileGymInput =
  document.getElementById(
    "profileGymInput"
  );

let selectedPlace = null;

if (profileGymInput) {

  const autocomplete =
    new google.maps.places.Autocomplete(
      profileGymInput,
      {
        types: ["establishment"],
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "place_id"
        ]
      }
    );

  autocomplete.addListener(
    "place_changed",
    () => {

      const place =
        autocomplete.getPlace();

      if (!place.geometry) return;

      selectedPlace = {
        name:
          place.name || "",

        address:
          place.formatted_address || "",

        lat:
          place.geometry.location.lat(),

        lng:
          place.geometry.location.lng(),

        placeId:
          place.place_id || ""
      };

      console.log(
        "Selected place:",
        selectedPlace
      );

    
        }
      );

    }

  }
);

 
    // =========================
    // FIREBASE SAVE (LATER)
    // =========================

    /*
    await setDoc(
      doc(db, "users", uid),
      {
        location: selectedPlace
      }
    );
    */

  }
);
