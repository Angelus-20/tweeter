$(document).ready(function() {
  const errorMessage = $('.error-message');

  $('form').on('submit', function(event) {
    event.preventDefault();

    const tweetContent = $('#tweet-text').val();
    const remainingCharacters = 140 - tweetContent.length;

    if (!tweetContent) {
      showError('Tweet content is required.');
      return;
    }

    if (remainingCharacters < 0) {
      showError('Tweet content is too long.');
      return;
    }

    hideError(); // Hide the error message if there is no error

    const formData = $(this).serialize();
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formData,
      success: function(response) {
        $('#tweet-text').val('');
        updateCharacterCounter(); // Reset character counter
        console.log('Tweet successfully submitted:', response);
        displayTweets();
      },
      error: function(error) {
        console.error('Error submitting tweet:', error);
        showError('Error submitting tweet. Please try again.');
      }
    });
  });

  function updateCharacterCounter() {
    const tweetContent = $('#tweet-text').val();
    const remainingCharacters = 140 - tweetContent.length;
    const counterElement = $('#tweet-counter');

    counterElement.text(remainingCharacters);
  }

  function showError(message) {
    errorMessage.text(message).slideDown();
  }

  function hideError() {
    errorMessage.slideUp();
  }

  function displayTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function(tweets) {
        renderTweets(tweets);
      },
      error: function(error) {
        console.error('Error fetching tweets:', error);
      }
    });
  }

  const createTweetElement = function(tweet) {
    let timeStamp = $.timeago(tweet.created_at);
      const $tweet = $(`
        <article class="tweet">
          <header class="tweet-header">
            <img src="${tweet.user.avatars}" alt="User Avatar">
            <h3>${$("<div>").text(tweet.user.name).html()}</h3>
            <span>${$("<div>").text(tweet.user.handle).html()}</span>
          </header>
          <div class="tweet-content">
            <p>${$("<div>").text(tweet.content.text).html()}</p>
          </div>
          <footer class="tweet-footer">
            <span><i class="far fa-solid fa-comment"></i> 5</span>
            <span><i class="fas fa-retweet"></i> 10</span>
            <span><i class="far fa-solid fa-heart"></i> 15</span>
            <span><i class="fas fa-share"></i></span>
            <span class="time">${timeStamp}</span>
          </footer>
        </article>
      `);
      //$('#tweetmsg').empty(); 
      return $tweet;
    };

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweetElement = createTweetElement(tweet);
      $('#tweetmsg').prepend($tweetElement);
    }
  };
});
