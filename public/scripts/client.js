$(document).ready(function() {
  // Select the error message element
  const errorMessage = $('.error-message');

  // Handle form submission
  $('form').on('submit', function(event) {
    event.preventDefault();

    // Get tweet content and calculate remaining characters
    const tweetContent = $('#tweet-text').val().trim();
    const remainingCharacters = 140 - tweetContent.length;

    // Handle empty tweet content
    if (!tweetContent) {
      showError('Tweet content is required.');
      return;
    }

    // Handle tweet content exceeding character limit
    if (remainingCharacters < 0) {
      showError('Tweet content is too long.');
      return;
    }

    hideError(); // Hide the error message if there is no error

    // Serialize form data and send AJAX POST request
    const formData = $(this).serialize();
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formData,
      success: function(response) {
        console.log('Tweet successfully submitted:', response);
        $('#tweet-text').val('');
        $('.counter').text(140);
        displayTweets();
      },
      error: function(error) {
        console.error('Error submitting tweet:', error);
        showError('Error submitting tweet. Please try again.');
      }
    });
  });

  // Display error message
  function showError(message) {
    errorMessage.text(message).slideDown();
  }

  // Hide error message
  function hideError() {
    errorMessage.slideUp();
  }

  // Fetch and display tweets
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

  // Initialize by displaying existing tweets
  displayTweets();

  // Create a tweet element
  const createTweetElement = function(tweet) {
    let timeStamp = $.timeago(tweet.created_at);
    const $tweet = $(`
        <article class="tweet">
          <header class="tweet-header">
          <div>
            <img src="${tweet.user.avatars}" alt="User Avatar">
            <h3>${$("<div>").text(tweet.user.name).html()}</h3>
            </div>
            <div class="handle">
            <span>${$("<div>").text(tweet.user.handle).html()}</span>
            </div>
            </header>
            <div class="tweet-content">
            <p>${$("<div>").text(tweet.content.text).html()}</p>
            </div>
            <footer class="tweet-footer">
            <div>
            <span class="time">${timeStamp}</span>
            </div>
            <div class="icons">
            <span><i class="far fa-solid fa-comment"></i> 5</span>
            <span><i class="fas fa-retweet"></i> 10</span>
            <span><i class="far fa-solid fa-heart"></i> 15</span>
            <span><i class="fas fa-share"></i></span> 
            </div>
            </footer>
        </article>
      `);
    return $tweet;
  };

  const renderTweets = function(tweets) {
    $('#tweetmsg').empty(); // Clear the container before rendering
    for (const tweet of tweets) {
      const $tweetElement = createTweetElement(tweet);
      $('#tweetmsg').prepend($tweetElement);
    }
  };
});
