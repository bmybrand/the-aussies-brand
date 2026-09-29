document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.btn-solidcolor2');
    const circle = document.querySelector('.circle-2');
    const colorBg = document.querySelector('.color-bg');
    
    // Get circle position
    function updateColorBg() {
        const circleRect = circle.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const circleX = circleRect.left - buttonRect.left + circleRect.width / 2;
        const circleY = circleRect.top - buttonRect.top + circleRect.height / 2;
        
        // Set initial small size at circle position
        colorBg.style.width = '12px';
        colorBg.style.height = '12px';
        colorBg.style.left = circleX - 6 + 'px';

        // 🔥 পরিবর্তন এখানে
        colorBg.style.top = '50%';
        colorBg.style.transform = 'translateY(-50%)';
    }
    
    updateColorBg();
    window.addEventListener('resize', updateColorBg);
    
    button.addEventListener('mouseenter', () => {
        const circleRect = circle.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const circleX = circleRect.left - buttonRect.left + circleRect.width / 2;
        const circleY = circleRect.top - buttonRect.top + circleRect.height / 2;
        
        // Calculate size needed to cover entire button
        const maxDistance = Math.max(
            Math.hypot(circleX, circleY),
            Math.hypot(buttonRect.width - circleX, circleY),
            Math.hypot(circleX, buttonRect.height - circleY),
            Math.hypot(buttonRect.width - circleX, buttonRect.height - circleY)
        );
        
        const size = maxDistance * 2 + 20;
        
        colorBg.classList.remove('shrinking');
        colorBg.classList.add('expanding');
        
        colorBg.style.width = size + 'px';
        colorBg.style.height = size + 'px';
        colorBg.style.left = circleX - size / 2 + 'px';

        // 🔥 পরিবর্তন এখানে
        colorBg.style.top = '50%';
        colorBg.style.transform = 'translateY(-50%)';
    });
    
    button.addEventListener('mouseleave', () => {
        colorBg.classList.remove('expanding');
        colorBg.classList.add('shrinking');
        updateColorBg();
    });
});