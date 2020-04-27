$(document).ready(() => {
    $('form, div, button').each(function (i) {
        $(this).delay(i * 500).animate({ opacity: 0.8 });
    });
});