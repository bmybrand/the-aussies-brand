// document.addEventListener('DOMContentLoaded', function () {

//     const buttons = document.querySelectorAll('.multicolumn-tab');

//     buttons.forEach(btn => {
//         btn.addEventListener('click', function () {

//             const filter = this.getAttribute('data-filter');

//             const url = new URL(window.location.href);

//             // update filter
//             if (filter === 'all') {
//                 url.searchParams.delete('case_filter');
//             } else {
//                 url.searchParams.set('case_filter', filter.replace('.', ''));
//             }

//             url.searchParams.delete('paged');

//             window.location.href = url.toString();
//         });
//     });

//     // ✅ ACTIVE CLASS FIX (IMPORTANT)
//     const params = new URLSearchParams(window.location.search);
//     let current = params.get('case_filter') || 'all';

//     buttons.forEach(btn => {
//         const filter = btn.getAttribute('data-filter').replace('.', '');

//         if (
//             (current === 'all' && filter === 'all') ||
//             current === filter
//         ) {
//             btn.classList.add('mixitup-control-active');
//         } else {
//             btn.classList.remove('mixitup-control-active');
//         }
//     });

// });



document.addEventListener('DOMContentLoaded', function () {

    const buttons   = document.querySelectorAll('.multicolumn-tab');
    const container = document.querySelector('#case-results');
    const hidden    = document.getElementById('case-filter-hidden');

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {

            buttons.forEach(b => b.classList.remove('mixitup-control-active'));
            this.classList.add('mixitup-control-active');

            const filter   = this.dataset.filter.replace('.', '');
            const industry = new URLSearchParams(window.location.search).get('industry') || '';

            // keep hidden form input in sync so industry reloads preserve this selection
            if (hidden) hidden.value = filter;

            fetch('/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=filter_posts&filter=' + encodeURIComponent(filter) + '&industry=' + encodeURIComponent(industry)
            })
            .then(res => res.text())
            .then(html => {
                container.innerHTML = html;
            });

        });
    });

});





