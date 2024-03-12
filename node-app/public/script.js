document.addEventListener("DOMContentLoaded", function () {
  var otherCauseContainer = document.getElementById("otherCauseContainer");
  var otherLocationContainer = document.getElementById(
    "otherLocationContainer"
  );
  var drugReactionContainer = document.getElementById("drugReactionContainer");
  var otherNatureContainer = document.getElementById("otherNatureContainer");

  document.addEventListener("change", function (event) {
    var target = event.target;

    if (target.id === "inputCauseOfFall") {
      updateFieldVisibility(target.value, otherCauseContainer);
    } else if (target.id === "inputFallLocation") {
      updateFieldVisibility(target.value, otherLocationContainer);
    } else if (target.id === "inputMedication") {
      updateFieldVisibility(target.value, drugReactionContainer);
    } else if (target.id === "inputNatureOfInjury") {
      updateFieldVisibility(target.value, otherNatureContainer);
    }
  });
});

function updateFieldVisibility(selectedValue, fieldContainer) {
  try {
    // Log the selected value for debugging
    //console.log("Selected Value:", selectedValue);

    var displayValue =
      selectedValue === "Other" || selectedValue === "Drug Reaction"
        ? "block"
        : "none";

    // Log the display value for debugging
    //console.log("Display Value:", displayValue);

    fieldContainer.style.display = displayValue;
  } catch (error) {
    console.error("Error updating field visibility:", error);
  }
}
