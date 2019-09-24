if (window.location.pathname === '/') {
  $('#nav-mobile').append('<li><a href="./register">REGISTER</a></li>');
} else {
  $('#nav-mobile').append('<li><a href="./">HOME</a></li>');
}
