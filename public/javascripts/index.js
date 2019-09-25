if (window.location.pathname === '/') {
  $('#nav-mobile').append('<li><a href="./register">REGISTER</a></li>');
} else {
  $('#nav-mobile').append('<li><a href="./">HOME</a></li>');
}

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year
  format: 'yyyy-mm-dd'
});
