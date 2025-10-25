var images = ["mmexport1672546129508.jpg","mmexport1672546126585.jpg","mmexport1672546123042.jpg","mmexport1672546119622.jpg","mmexport1672546115614.jpg","mmexport1672546112535.jpg","mmexport1672546109204.jpg","mmexport1672546104917.jpg","mmexport1672546099981.jpg","mmexport1672546096215.jpg","mmexport1672546083144.jpg","mmexport1672546077905.jpg","mmexport1672546074836.jpg","mmexport1672546067568.jpg","mmexport1672546063026.jpg","mmexport1672546060190.jpg","mmexport1672546056128.jpg","mmexport1672546052775.jpg","mmexport1672546049509.jpg","mmexport1672546046351.jpg","mmexport1672546042731.jpg","mmexport1672546038763.jpg","mmexport1672546035972.jpg","mmexport1672546031747.jpg","mmexport1672546024208.png","mmexport1672546017767.jpg","mmexport1672546014550.jpg","mmexport1672546011294.jpg","mmexport1672546007196.jpg","mmexport1672546002043.jpg","mmexport1672545998093.jpg","mmexport1672545995484.jpg","mmexport1672545990318.jpg","mmexport1672545984473.jpg","mmexport1672545977591.jpg","mmexport1672545973976.jpg","mmexport1672545970349.jpg","mmexport1672545962974.jpg","mmexport1672545957990.jpg","mmexport1672545954883.jpg","mmexport1672545951515.jpg","mmexport1672545948177.jpg","mmexport1672545944050.jpg","mmexport1672545939995.jpg","mmexport1672545934221.jpg","mmexport1672545928308.jpg","mmexport1672545923892.jpg","mmexport1672545918509.jpg","mmexport1672545915824.jpg","mmexport1672545911586.jpg","mmexport1672545906412.jpg","mmexport1672545902204.jpg","mmexport1672545897942.jpg","mmexport1672545893607.jpg","mmexport1672545887830.jpg","mmexport1672545885693.jpg","mmexport1672545881186.jpg","mmexport1672545877952.jpg","mmexport1672545869628.jpg","mmexport1672545865633.jpg","mmexport1672545862231.jpg","mmexport1672545855824.jpg","mmexport1672545853405.jpg","mmexport1672545850359.jpg","mmexport1672545844440.jpg","mmexport1672545838762.jpg","mmexport1672545835560.jpg","mmexport1672545831985.jpg","mmexport1672545826395.jpg","mmexport1672545822920.jpg","mmexport1672545819233.jpg","mmexport1672545815780.jpg","mmexport1672545812663.jpg","mmexport1672545809039.jpg","mmexport1672545804287.jpg","mmexport1672545799560.jpg","mmexport1672545795262.jpg","mmexport1672545790940.jpg","mmexport1672545786011.jpg","mmexport1672545780404.jpg","mmexport1672545777781.jpg","mmexport1672545773485.jpg","mmexport1672545768762.jpg","mmexport1672545756455.jpg","mmexport1672545752257.jpg","mmexport1672545747897.jpg","mmexport1672545743597.jpg","mmexport1672545738992.jpg","mmexport1672545734760.jpg","mmexport1672545729544.jpg","mmexport1672545726919.jpg","mmexport1672545722410.jpg","mmexport1672545719133.jpg","mmexport1672545714711.jpg","mmexport1672545711752.jpg","mmexport1672545708248.jpg","mmexport1672545703799.jpg","mmexport1672545701293.jpg","mmexport1672545693857.jpg","mmexport1672545688837.jpg","mmexport1672545684408.jpg","mmexport1672545680060.jpg","mmexport1672545675295.jpg","mmexport1672545671032.jpg","mmexport1672545666720.jpg","mmexport1672545662471.jpg","mmexport1672545658239.jpg","mmexport1672545652524.jpg","mmexport1672545650349.jpg","mmexport1672545645394.jpg","mmexport1672545640518.jpg","mmexport1672545635546.jpg","mmexport1672545632375.jpg","mmexport1672545628907.jpg","mmexport1672545623570.jpg","mmexport1672545617285.jpg","mmexport1672545609023.jpg","mmexport1672545600891.jpg","mmexport1672545597623.jpg","mmexport1672545592314.jpg","mmexport1672545589546.jpg","mmexport1672545586425.jpg","mmexport1672545582834.jpg","mmexport1672545577555.jpg","mmexport1672545574027.jpg","mmexport1672545570872.png","mmexport1672545567926.jpg","mmexport1672545561792.jpg","mmexport1672545553725.jpg","mmexport1672545549387.jpg","mmexport1672545545195.jpg","mmexport1672545540932.jpg","mmexport1672545535369.jpg","mmexport1672545532855.jpg","mmexport1672545527697.jpg","mmexport1672545525006.jpg","mmexport1672545517012.jpg","mmexport1672545514342.jpg","mmexport1672545509355.jpg","mmexport1672545505278.jpg","mmexport1672545499498.jpg","mmexport1672545494887.jpg","mmexport1672545491530.jpg","mmexport1672545484379.jpg","mmexport1672545478483.jpg","mmexport1672545475444.jpg","mmexport1672545470383.jpg","mmexport1672545464258.jpg"];
window.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var imgName = params.get('img');
  var imgElem = document.getElementById('main-img');
  var annoElem = document.getElementById('annotation');
  var arrowLeft = document.getElementById('arrow-left');
  var arrowRight = document.getElementById('arrow-right');
  var progressElem = document.getElementById('progress');
  var imgContainer = document.getElementById('img-container');
  if (!imgName && images.length > 0) imgName = images[0];
  
  var currentIndex = images.indexOf(imgName);
  
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
});

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
