document.addEventListener("DOMContentLoaded", function () {

    let groups = document.querySelectorAll('.strategy-list-content');
    let firstItems = [];
    let maxHeight = 0;

    groups.forEach(group => {
        let first = group.querySelector('.strategy-list-content-item');
        if (first) {
            first.style.height = 'auto'; // reset
            firstItems.push(first);
        }
    });

    firstItems.forEach(item => {
        if (item.offsetHeight > maxHeight) {
            maxHeight = item.offsetHeight;
        }
    });

    firstItems.forEach(item => {
        item.style.height = maxHeight + 'px';
    });

});