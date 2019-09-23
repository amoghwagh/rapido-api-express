module.exports = {
  formatDate: value => {
    console.log(value);
    const formatedMysqlString = new Date(
      new Date(new Date(new Date(value)).toISOString()).getTime() -
        new Date(value).getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10)
      .replace('T', ' ');
    return formatedMysqlString;
  }
};
