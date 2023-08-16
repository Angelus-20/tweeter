$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    const inputValue = $(this).val();
    const inputLength = inputValue.length;
    const remainingCharacters = 140 - inputLength;
    const counterElement = $(this).siblings(":last").children().last();
    counterElement.text(remainingCharacters);
    
    if (remainingCharacters < 0) {
      counterElement.addClass('invalid');
    } else {
      counterElement.removeClass('invalid');
    }
  });
});
