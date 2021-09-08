const express = require("express");
const app = express();
const fs = require("fs");
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
  addVue("acceuil");
  if (process.platform === "darwin") {
    code = `Welcome to TextBin!
  
use the commands in the top right corner
to create a new file to share with others.

## SHORCUTS
you can do ⌘ + Shift + S to save
you can do ⌘ + Shift + D to dupicate
you can do ⌘ + Shift + N to start a new text
you can do ⌘ + Shift + R to get the raw value

## CUSTOMISATION 
you can customize what langage-hightlight you want with 
http://textbin.polo5922.com/code-{langageWanted}`;
  } else {
    code = `Welcome to TextBin!
  
use the commands in the top right corner
to create a new file to share with others.

## SHORCUTS
you can do Ctrl + Shift + S to save
you can do Ctrl + Shift + D to dupicate
you can do Ctrl + Shift + N to start a new text
you can do Ctrl + Shift + R to get the raw value

## CUSTOMISATION 
you can customize what langage-hightlight you want with 
http://textbin.polo5922.com/code-{langageWanted}`;
  }
  res.render("code-display", { code, language: "markdown", page: "acceuil" });
});

app.get("/new", (req, res) => {
  addVue("new");
  res.render("new");
});

app.get("/changelog.md", (req, res) => {
  addVue("changelog");
  fs.readFile("./changelog.md", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    code = data;
    res.render("code-display", {
      code,
      language: "markdown",
      page: "changelog",
    });
  });
});

app.post("/save", (req, res) => {
  addVue("save");
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
  addVue("duplicate");
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
  addVue("raw");
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

app.get("/:id-:language", async (req, res) => {
  addVue("langage");
  const id = req.params.id;
  const language = req.params.language;
  console.log(language);
  try {
    const snapshot = await db.collection("files").doc(id).get("value");
    const data = snapshot.data();
    console.log(data.value);
    res.render("code-display", { code: data.value, id, language });
  } catch (e) {
    res.redirect("/");
  }
});

app.get("/:id", async (req, res) => {
  addVue("viewDocument");
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

async function addVue(type) {
  console.log(type);
  const snapshot = await db.collection("global").doc("vue").get(type);
  const data = snapshot.data();
  console.log(data[type]);
  if (data[type] === undefined) {
    obj = `{ ${type} : 1}`;
  } else {
    obj = `{ ${type} : ${data[type] + 1}}`;
  }
  console.log(obj);
  eval("var newObj =" + obj);
  console.log(newObj);
  db.collection("global").doc("vue").update(newObj);
}

app.listen(3000);
