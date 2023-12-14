function cleanText(text) {
  text = text.toUpperCase();
  //text = text.replaceAll('(', '');
  //text = text.replaceAll(')', '');
  text = text.replaceAll("'", '');
  text = text.replaceAll("SELECT", '');
  //text = text.replaceAll("*", '');
  text = text.replaceAll("FROM", '');
  text = text.replaceAll("INSERT", '');
  text = text.replaceAll("DELETE", '');
  text = text.replaceAll("UPDATE", '');
  text = text.replaceAll("TRUNCATE", '');
  text = text.replaceAll("DROP", '');
  text = text.replaceAll("UNION", '');
  text = text.replaceAll("WHERE", '');
  text = text.replaceAll("FROM", '');
  text = text.trim()
  return text
}

module.exports = { cleanText }
