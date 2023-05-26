const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact } = require("./utils/contacts");

const app = express();
const port = 3000;

// Gunakan EJS
app.set("view engine", "ejs");

// Third-party Middleware
app.use(expressLayouts);

// Built-in Middleware
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
  });
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail Contact",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.render("error404", {
    layout: "layouts/main-layout",
    title: "Error 404",
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

