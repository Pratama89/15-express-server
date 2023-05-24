const express = require("express");
const expressLayouts = require('express-ejs-layouts')

const app = express();
const port = 3000;

// Gunakan EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/about", (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About'
  });
});

app.get("/contact", (req, res) => {
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contact',
  });
});

app.use("/", (req, res) => {
  res.status(404)
  res.send("404");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

