function formatDate(date) {
  const formatedMysqlString = new Date(
    new Date(new Date(new Date(date)).toISOString()).getTime() -
      new Date(date).getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10)
    .replace('T', ' ');
  return formatedMysqlString;
}

module.exports = formatDate;
