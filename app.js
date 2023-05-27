const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// Gunakan EJS
app.set("view engine", "ejs");
app.use(expressLayouts); // Third-party Middleware
app.use(express.static("public")); // Built-in Middleware
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    saveUninitialized: true,
  })
);
app.use(flash());

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
    msg: req.flash("msg"),
  });
});

// Halaman Form tambah data kontak
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Form Tambah Contact",
  });
});

// Proses Data kontak
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama kontak sudah digunakan!");
      }
      return true;
    }),

    check("alamat", "Alamat tidak sesuai").isString(),
    check("no_HP", "No HP tidak sesuai").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({
      //   errors: errors.array(),
      // });
      res.render("add-contact", {
        layout: "layouts/main-layout",
        title: "Form Tambah Data Contact",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // kirimkan Flash massage
      req.flash("msg", "Data kontak berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);

// proses delete kontak
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // Jika kontak tidak ada
  if (!contact) {
    res.status(404);
    res.render("error404", {
      layout: "layouts/main-layout",
      title: "Error 404",
    });
  } else {
    deleteContact(req.params.nama);
    // kirimkan Flash massage
    req.flash("msg", "Data kontak berhasil dihapus");
    res.redirect("/contact");
  }
});

// Halaman Form ubah data kontak
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Form Ubah Data Contact",
    contact,
  });
});

// Proses Ubah Data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, {req}) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama kontak sudah digunakan!");
      }
      return true;
    }),

    check("alamat", "Alamat tidak sesuai").isString(),
    check("no_HP", "No HP tidak sesuai").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({
      //   errors: errors.array(),
      // });
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Form Tambah Data Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      
      updateContacts(req.body);
      // kirimkan Flash massage
      req.flash("msg", "Data kontak berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

// Halaman detail kontak
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

