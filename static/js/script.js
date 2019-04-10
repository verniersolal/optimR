$(document).ready(function () {
    $('.sidenav').sidenav();
});

$(document).ready(function () {
    $('select').formSelect();
});

$('.saveInput').on('change',function () {
   $('#saveInfoBtn').removeClass("disabled");
});