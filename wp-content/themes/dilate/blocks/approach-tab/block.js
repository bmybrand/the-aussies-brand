document.addEventListener("DOMContentLoaded", function () {
 
    const buttons = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content-list");
    const tabButtonGroups = document.querySelectorAll(".tab-button-group");
 
    if (contents.length <= 1) {
        tabButtonGroups.forEach(group => group.style.display = "none");
    }
 
    // Hide all content except first
    contents.forEach((content, index) => {
        content.style.display = index === 0 ? "block" : "none";
    });
 
    // Activate first button
    buttons.forEach(btn => btn.classList.remove("active"));
    buttons.forEach(btn => {
        if (btn.getAttribute("data-tab") === "0") {
            btn.classList.add("active");
        }
    });
 
    // Add click event
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const tabIndex = this.getAttribute("data-tab");

            // Remove active from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));

            // Add active to ALL matching buttons (top + bottom sync)
            buttons.forEach(btn => {
                if (btn.getAttribute("data-tab") === tabIndex) {
                    btn.classList.add("active");
                }
            });

            // Hide all contents
            contents.forEach(content => content.style.display = "none");

            // Show correct content
            if (contents[tabIndex]) {
                contents[tabIndex].style.display = "block";
            }
        });
    });
 
 
 
    const rows = document.querySelectorAll('.tab-content-row');
 
    rows.forEach((row, i) => {
        if (i === 0) {
            activateRow(row);
        }
        row.onmouseenter = () => {
            rows.forEach(r => deactivateRow(r));
            activateRow(row);
        };
    });
 
    function activateRow(row) {
        row.classList.add('active');
        row.style.maxHeight = row.scrollHeight + 'px';
    }
 
    function deactivateRow(row) {
        row.classList.remove('active');
 
        // check screen width
        if (window.innerWidth <= 767) {
            row.style.maxHeight = '170px'; // small screens
        } else {
            row.style.maxHeight = '230px'; // normal screens
        }
    }
 
    // Optional: update maxHeight on window resize
    window.addEventListener('resize', () => {
        rows.forEach(row => {
            if (!row.classList.contains('active')) {
                deactivateRow(row);
            } else {
                row.style.maxHeight = row.scrollHeight + 'px';
            }
        });
    });
 
});