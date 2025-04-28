$(document).ready(function() {

  $('.new-tweet textarea').on('input', function() {
    const wordLimit = 140;

    const inputLength = $(this).val().length;
    const wordLeft = wordLimit - inputLength;
  
    const counter = $(this).closest('form').find('.counter');
  
    counter.text(wordLeft);
  
    if (wordLeft < 0) {
      counter.addClass('outOfWords');
    } else {
      counter.removeClass('outOfWords');
    }
  });
  





});