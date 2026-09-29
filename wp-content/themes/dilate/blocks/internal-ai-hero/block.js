document.addEventListener('DOMContentLoaded', function () {

    const wrapper = document.querySelector('.hero-video-wrapper');
    if (!wrapper) return;

    const button = wrapper.querySelector('.video-toggle');
    const thumbnail = wrapper.querySelector('.video-thumbnail');
    const iframes = wrapper.querySelectorAll('iframe');

    let activePlayer = null;
    let isPlaying = false;

    function getVisibleIframe() {
        return Array.from(iframes).find(iframe => {
            return iframe.offsetParent !== null;
        });
    }

    button.addEventListener('click', function () {

        const visibleIframe = getVisibleIframe();

        if (!isPlaying) {

            if (visibleIframe && visibleIframe.src.includes('vimeo')) {
                activePlayer = new Vimeo.Player(visibleIframe);

                activePlayer.play();

                // 👉 VIDEO END
                activePlayer.on('ended', function () {
                    isPlaying = false;
                    button.style.display = 'flex';
                    activePlayer.setCurrentTime(0);
                });

                // 👉 PAUSE DETECT
                activePlayer.on('pause', function () {
                    isPlaying = false;
                    button.style.display = 'flex';
                });

                // 👉 PLAY DETECT
                activePlayer.on('play', function () {
                    isPlaying = true;
                    button.style.display = 'none';
                });
            }

            if (thumbnail) thumbnail.style.display = 'none';
            button.style.display = 'none';

            isPlaying = true;

        } else {

            if (activePlayer) {
                activePlayer.pause();
            }

            button.style.display = 'flex';
            isPlaying = false;
        }

    });

});





// video-expand
document.addEventListener("DOMContentLoaded", function () {

    const videoSection = document.querySelector('.video-expand-wrapper');

    if(!videoSection) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){
                videoSection.classList.add('expand');
            }

        });

    }, {
        threshold: 0.6
    });

    observer.observe(videoSection);

});
