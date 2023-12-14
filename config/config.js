const config = {
  port: 8980,
  jwtSecret: "N1Xl9p8xoweCMJBnf3UjsDWzLhmEbvQR",
  jwtRefreshSecret: "N1Xl9p8xoweCMJBnf3UjsDWzLhmEbvQZ",
  shaKey: "kitconsultores",
  db: {
    host: "ELVIS-RETIZ",
    instance: "",
    name: "MonLogistica",
    user: "sa",
    pwd: "kitsacv"
  },
  mail: {
    host: "mail.gpoasshel.com",
    port: 465,
    user: "eretiz_kit@gpoasshel.com",
    pwd: "er201115"
  }
}

module.exports = { config };
