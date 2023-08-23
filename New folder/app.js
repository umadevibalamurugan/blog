$(document).ready(function() {
    const tweetsContainer = $('#tweets');
    const initialTweets = [
      { content: 'Just setting up my Twitter!', media: 'image.jpg', timestamp: '2023-08-17', likes: 10, comments: [] },
      // Add more sample tweets here
    ];
  
    initialTweets.forEach(tweet => {
      displayTweet(tweet);
    });
  $('#edit-profile-form').submit(function(e) {
      e.preventDefault();
    });
  
    $('#compose-form').submit(function(e) {
      e.preventDefault();
      const tweetContent = $('#tweet-content').val();
      const mediaFile = $('#media')[0].files[0];
  
      if (tweetContent.trim() !== '' || mediaFile) {
        const newTweet = {
          content: tweetContent,
          media: mediaFile ? URL.createObjectURL(mediaFile) : null,
          timestamp: getCurrentTimestamp(),
          likes: 0,
          comments: []
        };
        displayTweet(newTweet);
        $('#tweet-content').val('');
        $('#media').val('');
      }
    });
  
    function displayTweet(tweet) {
      const tweetElement = $('<div class="tweet">');
      tweetElement.append('<p>' + tweet.content + '</p>');
  
      if (tweet.media) {
        if (tweet.media.startsWith('blob')) {
          const img = new Image();
          img.onload = function() {
            const resizedImgDataUrl = resizeImage(img, 300);
            tweetElement.append('<img src="' + resizedImgDataUrl + '" alt="Media">');
          };
          img.src = tweet.media;
        } else {
          tweetElement.append('<video controls><source src="' + tweet.media + '"></video>');
        }
      }
  
      tweetElement.append('<small>' + tweet.timestamp + '</small>');
      tweetElement.append('<button class="like-btn">Like (' + tweet.likes + ')</button>');
      tweetElement.append('<button class="comment-btn">Comment</button>');
      tweetElement.append('<button class="delete-btn">Delete</button>');
  
      const commentList = $('<ul class="comment-list"></ul>');
      tweet.comments.forEach((comment, index) => {
        commentList.append('<li>' + comment + ' <button class="delete-comment-btn" data-index="' + index + '">Delete</button></li>');
      });
      tweetElement.append(commentList);
  
      tweetsContainer.prepend(tweetElement);
    }
  
    function resizeImage(img, maxWidth) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const aspectRatio = img.width / img.height;
      const newWidth = Math.min(maxWidth, img.width);
      const newHeight = newWidth / aspectRatio;
  
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
      return canvas.toDataURL('image/jpeg', 0.8);
    }
  
    tweetsContainer.on('click', '.like-btn', function() {
      const likeBtn = $(this);
      const tweetElement = likeBtn.closest('.tweet');
      const likesLabel = likeBtn.text().match(/\d+/);
      const newLikes = parseInt(likesLabel[0]) + 1;
      likeBtn.text('Like (' + newLikes + ')');
    });
  
    tweetsContainer.on('click', '.delete-btn', function() {
      const tweetElement = $(this).closest('.tweet');
      tweetElement.remove();
    });
  
    tweetsContainer.on('click', '.comment-btn', function() {
      const tweetElement = $(this).closest('.tweet');
      const comment = prompt('Enter your comment:');
  
      if (comment !== null && comment.trim() !== '') {
        const commentList = tweetElement.find('.comment-list');
        const listItem = $('<li>' + comment + ' <button class="delete-comment-btn">Delete</button></li>');
        commentList.append(listItem);
      }
    });
  
    tweetsContainer.on('click', '.delete-comment-btn', function() {
      const commentIndex = $(this).parent().index();
      const tweetElement = $(this).closest('.tweet');
      tweetElement.find('.comment-list li:eq(' + commentIndex + ')').remove();
    });
  
    function getCurrentTimestamp() {
      const now = new Date();
      return now.toLocaleString();
    }
  });
  