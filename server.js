const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/", (req, res) => {
  code = `Welcome to TextBin!
  
  use the commands in the top right corner
  to create a new file to share with others.

  ## SHORCUTS
  you can do Ctrl + Shift + S to save
  you can do Ctrl + Shift + D to dupicate
  you can do Ctrl + Shift + N to start a new text
  you can do Ctrl + Shift + R to get the raw value`;
  res.render("code-display", { code, language: "plaintext", page: "acceuil" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", (req, res) => {
  const value = req.body.value;
  console.log(value);

  db.collection("files")
    .add({ value: value })
    .then((docRef) => {
      res.redirect(`/${docRef.id}`);
    })
    .catch((error) => res.render("new", { value }));
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const snapshot = await db.collection("files").doc(id).get("value");
    const data = snapshot.data();
    console.log(data.value);
    res.render("new", { value: data.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id/raw", async (req, res) => {
  const id = req.params.id;
  try {
    const snapshot = await db.collection("files").doc(id).get("value");
    const data = snapshot.data();
    console.log(data.value);
    res.render("raw", { code: data.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const snapshot = await db.collection("files").doc(id).get("value");
    const data = snapshot.data();
    console.log(data.value);
    res.render("code-display", { code: data.value, id });
  } catch (e) {
    res.redirect("/");
  }
});
app.listen(3000);
