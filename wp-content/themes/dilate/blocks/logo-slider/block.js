document.addEventListener('DOMContentLoaded', function () {
    var logoElement = document.querySelector('.logo_slider');
    if(logoElement){

    var logo = new Splide('.logo_slider', {
        type   : 'loop',
        perPage: 7,
        perMove: 1, 
        arrows: false, 
        pagination: false,
        gap: "40px",
        autoplay: true,
		interval: 1200,   
		speed: 6000,     
		easing: 'linear', 

		pauseOnHover: false,
		pauseOnFocus: false,
        breakpoints: {
            1024: {
                perPage: 4,
				speed: 2000,
            },
            767: {
                perPage: 2,
                padding: '20px',
				speed: 2000,
            },
        },
        arrowPath: '', 
    });

    logo.mount();
    }


});