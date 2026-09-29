document.addEventListener('DOMContentLoaded', function () {

    /* MIXITUP (UNCHANGED) */
    var mixer = mixitup('#mix-container', {
        selectors: {
            target: '.mix'
        },
        controls: {
            enable: false 
        }
    });

    /* =========================
       HIDE / SHOW (GRID SAFE)
    ========================== */
    document.querySelectorAll('.toggle-btn').forEach(function(btn){

        btn.addEventListener('click', function(){

            const header = this.closest('.border-b');
            const content = header.nextElementSibling;

            const isHidden = window.getComputedStyle(content).display === 'none';

            if (isHidden) {
                content.style.display = '';
                this.classList.remove('active');
            } else {
                content.style.display = 'none';
                this.classList.add('active');
            }

        });

    });

});