$(document).ready(function () {
    
    $('#minimize').click(function () {
      window.electron.minimize();
    });
  
    $('#maximize').click(function () {
      window.electron.maximize();
    });
  
    $('#close').click(function () {
      window.electron.close();
    });
  });
  