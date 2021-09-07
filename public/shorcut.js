window.onload = () => {
  if (document.getElementById("canSave") != undefined) {
    const canSave = document.getElementById("canSave").value;
    console.log("canSave Exist : " + canSave);
  }
  if (document.getElementById("id") != undefined) {
    const id = document.getElementById("id").value;
    console.log("id Exist : " + id);
  }
  document.addEventListener(
    "keydown",
    function (e) {
      if (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
        if (e.keyCode == 83) {
          e.preventDefault();
          if (canSave != null || canSave != undefined) {
            e.preventDefault();
            document.getElementById("save").click();
          }
        }
        if (e.keyCode == 78 && e.shiftKey) {
          e.preventDefault();
          window.location.replace("/new");
        }
        if (e.keyCode == 68 && e.shiftKey) {
          e.preventDefault();
          if (id != undefined) {
            e.preventDefault();

            window.location.replace("/" + id.value + "/duplicate");
          }
        }

        if (e.keyCode == 82 && e.shiftKey) {
          e.preventDefault();
          if (id != undefined) {
            e.preventDefault();

            window.location.replace("/" + id.value + "/raw");
          }
        }
      }
    },
    false
  );
};
