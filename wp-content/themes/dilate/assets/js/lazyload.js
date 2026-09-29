(function() {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', function() {
        let images = document.querySelectorAll('img[data-src], img[data-srcset]');
        let sources = document.querySelectorAll('picture source[data-srcset]');
        let sectionBGVideos = document.querySelectorAll('[data-fn="sectionBackgroundVideo"]');
  
        images.forEach(img => {
            if (img.dataset.src) {
                img.setAttribute('src', img.dataset.src);
            }
            if (img.dataset.srcset) {
                img.setAttribute('srcset', img.dataset.srcset);
            }
        });
        sources.forEach(source => {
            if (source.dataset.srcset) {
                source.setAttribute('srcset', source.dataset.srcset);
            }
        });
        sectionBGVideos.forEach(function(video) {
            var imgPlaceholder = video.previousElementSibling;
            var videoElement = video.querySelector('video');
            var file = videoElement.getAttribute('data-src');
            var mime = videoElement.getAttribute('data-mime');

            if (file && mime) {
                videoElement.setAttribute('src', file);
                videoElement.setAttribute('type', mime);
            }

            videoElement.muted = true;
            var playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    if (imgPlaceholder) {
                        imgPlaceholder.style.display = 'none';
                    }
                }).catch(function(error) {
                    console.error('Video autoplay was prevented:', error);
                });
            }
        });
    });
  
  })();