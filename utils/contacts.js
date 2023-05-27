const fs = require("fs");

// membuat folder jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contact.json jika belum ada
const dataPath = "./data/contact.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// mengambil data contact
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contact.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// cari kontak berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
}

// menuliskan/menimpa file contacts.JSON dengan data yang baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contact.json', JSON.stringify(contacts));
}

// menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

//  Cek nama duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
}

// Hapus Kontak
const deleteContact =(nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
}

module.exports = { loadContact, findContact, addContact , cekDuplikat, deleteContact };
