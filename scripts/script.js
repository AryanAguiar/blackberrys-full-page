function openSidenav() {
    document.getElementById("cartSidenav").style.width = "350px";
}

function closeSidenav() {
    document.getElementById("cartSidenav").style.width = "0";
}

document.getElementById("cartLink").addEventListener("click", function(event) {
    event.preventDefault(); 
    openSidenav(); 
});

function selectSize(element) {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
}

//fucntion for faq section
function showContent(sectionId) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    event.target.classList.add('active');

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function showContent2(sectionId) {
    document.querySelectorAll('.content-section').forEach(item => {
        item.classList.remove('active');
    });

    event.target.classList.add('active');

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

