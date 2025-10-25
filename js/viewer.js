var images = [];

// Load images list from JSON file
fetch('images.json')
  .then(function(response) {
    if (!response.ok) throw new Error('Failed to load images list');
    return response.json();
  })
  .then(function(data) {
    images = data;
    initViewer();
  })
  .catch(function(error) {
    console.error('Error loading images:', error);
    document.getElementById('loading-error').style.display = 'block';
    document.getElementById('content').style.display = 'none';
  });

function initViewer() {
  var params = new URLSearchParams(window.location.search);
  var imgName = params.get('img');
  var imgElem = document.getElementById('main-img');
  var annoElem = document.getElementById('annotation');
  var arrowLeft = document.getElementById('arrow-left');
  var arrowRight = document.getElementById('arrow-right');
  var progressElem = document.getElementById('progress');
  var imgContainer = document.getElementById('img-container');
  
  if (!imgName && images.length > 0) imgName = images[0];
  if (images.length === 0) {
    document.getElementById('loading-error').textContent = 'No images found in gallery.';
    document.getElementById('loading-error').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    return;
  }
  
  var currentIndex = images.indexOf(imgName);
  if (currentIndex === -1) currentIndex = 0;
  
  function updateImage(name) {
    imgElem.style.opacity = 0;
    imgElem.src = 'images/' + encodeURIComponent(name);
    var idx = images.indexOf(name);
    progressElem.textContent = 'Image ' + (idx+1) + ' of ' + images.length;
    
    // Update URL with current image
    var newUrl = new URL(window.location.href);
    newUrl.searchParams.set('img', name);
    window.history.pushState({img: name}, '', newUrl);
    
    var annoPath = 'images/' + encodeURIComponent(name) + '.anno';
    fetch(annoPath).then(function(r) {
      if (!r.ok) throw new Error();
      return r.text();
    }).then(function(t) {
      try {
        var d = JSON.parse(t);
        annoElem.textContent = JSON.stringify(d, null, 2);
      } catch(e) {
        annoElem.textContent = t || '';
      }
      annoElem.style.display = annoElem.textContent ? 'block' : 'none';
    }).catch(function() {
      annoElem.style.display = 'none';
    });
  }
  
  function goToPrevious() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage(images[currentIndex]);
  }
  
  function goToNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(images[currentIndex]);
  }
  
  imgElem.addEventListener('load', function() {
    imgElem.style.opacity = 1;
  });
  
  updateImage(images[currentIndex]);
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.img) {
      var idx = images.indexOf(e.state.img);
      if (idx !== -1) {
        currentIndex = idx;
        // Update display without pushing to history
        imgElem.style.opacity = 0;
        imgElem.src = 'images/' + encodeURIComponent(images[currentIndex]);
        progressElem.textContent = 'Image ' + (currentIndex+1) + ' of ' + images.length;
        
        var annoPath = 'images/' + encodeURIComponent(images[currentIndex]) + '.anno';
        fetch(annoPath).then(function(r) {
          if (!r.ok) throw new Error();
          return r.text();
        }).then(function(t) {
          try {
            var d = JSON.parse(t);
            annoElem.textContent = JSON.stringify(d, null, 2);
          } catch(e) {
            annoElem.textContent = t || '';
          }
          annoElem.style.display = annoElem.textContent ? 'block' : 'none';
        }).catch(function() {
          annoElem.style.display = 'none';
        });
      }
    }
  });
  
  // Click handlers
  arrowLeft.addEventListener('click', goToPrevious);
  arrowRight.addEventListener('click', goToNext);
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      goToNext();
    }
  });
  
  // Touch/swipe navigation
  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;
  var minSwipeDistance = 50;
  
  imgContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  imgContainer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;
    var absDeltaX = Math.abs(deltaX);
    var absDeltaY = Math.abs(deltaY);
    
    // Only process horizontal swipes (more horizontal than vertical)
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        goToPrevious();
      } else {
        // Swipe left - go to next
        goToNext();
      }
    }
  }
}

function syncAnnotationWidth() {
  var imgContainer = document.getElementById('img-container');
  var annotation = document.getElementById('annotation');
  if (imgContainer && annotation) {
    annotation.style.width = (imgContainer.offsetWidth - 20) + 'px';
  }
}

var mainImg = document.getElementById('main-img');
if (mainImg) {
  mainImg.addEventListener('load', syncAnnotationWidth);
}
window.addEventListener('resize', syncAnnotationWidth);
syncAnnotationWidth();
