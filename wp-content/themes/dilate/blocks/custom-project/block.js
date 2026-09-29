document.addEventListener('DOMContentLoaded', function () {
    var portfolioElement = document.querySelector('.project_slider');
    if(portfolioElement){

    var portfolio = new Splide('.project_slider', {
        type   : 'loop',
        perPage: 1,
        perMove: 1, 
        arrows: true, 
        pagination: false,
        speed: 1000,
        gap: "40px",
        breakpoints: {
            767: {
                arrows: false,
                pagination: true,
            },
        },
        classes: {
        arrows: 'splide__arrows custom-arrows',
        arrow : 'splide__arrow custom-arrow',
        prev  : 'splide__arrow--prev custom-prev',
        next  : 'splide__arrow--next custom-next',
        },

        arrowPath: '', 
    });

    portfolio.mount();
    }


});