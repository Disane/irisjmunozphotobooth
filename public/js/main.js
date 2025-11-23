const navbar = document.querySelector('nav');

// Transition effect for navbar 
window.addEventListener('scroll', (event) => {
    // console.log(window.scrollY);
    // checks if window is scrolled more than 500px, adds/removes solid class
    if (window.scrollY > 500) {
        navbar.classList.add('solid');
    }else{
        navbar.classList.remove('solid');
    }
});

// nav toggle
// read the height of the nav-link
const navLinks = document.getElementsByClassName('nav-links')[0];
const btnNavToggle = document.getElementById('nav-toggle');
const mainTitle = document.querySelector('h1.banner-title');
const subTitle = document.querySelector('h3.banner-subtitle');

const desktopScrollHeight = 56; // 1 times the scrollHeight of the nav-link on a steady state
const mobileScrollHeight = 380; // 6 times the scrollHeight of the nav-link on a steady state

var mediaWidth1010px = window.matchMedia("(min-width: 1010px)");

btnNavToggle.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.classList.toggle('show-links');
    btnNavToggle.classList.toggle('nav-toggled');

    mainTitle.classList.toggle('nav-toggle');
    subTitle.classList.toggle('nav-toggle');

    if(navLinks.classList.contains('show-links')){
        // increase the height by respecting the scroll height of the item
        navLinks.style.setProperty('height', mobileScrollHeight + 'px'); // magic number 336 is the scroll height in mobile view
    } else {
        navLinks.style.setProperty('height', 0 + 'px');
    }
});

/// Here we attach an event listener that monitors the width of the desktop screen
// this way we can adjust the height of the nav-links when the screen is being resized by the user
// This is basically a work around, that manipulates CSS in a way that actually works
function adjustNavLinkHeight(x) {
    if(x.matches){
        //console.log("more than 1010px!");
        navLinks.style.setProperty('height', desktopScrollHeight + 'px'); // magic number 24 is the scroll height in desktop view
    }else{
        //console.log("less than 1010px!");
        if(navLinks.classList.contains('show-links')){
            navLinks.style.setProperty('height', mobileScrollHeight + 'px');
        }else{
            navLinks.style.setProperty('height', 0 + 'px');
        }
    }
}
adjustNavLinkHeight(mediaWidth1010px);
mediaWidth1010px.addListener(adjustNavLinkHeight);

// nav fixed code for making the navbar get fixed to the top of the viewport
window.addEventListener("scroll", (e) => {
    if(window.pageYOffset > navbar.clientHeight){
        navbar.classList.add('fixed');
    }else{
        navbar.classList.remove('fixed');
    }
});

// smooth scroll
// supported scroll-link structures:
// anything that has a scroll-link as their parent or anchors with scroll-links
const scrollLinks = document.querySelectorAll('.scroll-link');
scrollLinks.forEach( (link) => {
    link.addEventListener('click', (e) => {
         // Make sure to set scroll-links as scroll-link
         // redirect links are ommited (see code below)
         if(!e.target.classList.contains('redirect-link')){

            // omits the browser from jumping to the specified href
            e.preventDefault(); 

            var id = null;

            // Accept any parent tags
            if(e.target.tagName!=="A"){
                id = e.target.parentElement.getAttribute('href').slice(1);
            }else{ // or direct anchors with scroll links
                id = e.target.getAttribute('href').slice(1);
            }

            const scrollTarget = document.getElementById(id);

            // window scrollTo
            window.scrollTo({
                left: 0,
                top: scrollTarget.offsetTop - navbar.clientHeight,
                behavior: "smooth"
            });
        }
    });
});

// Modal:
const contactModal = document.getElementById('contact-modal');
const contactModalActivateBtn = document.getElementById('btn-contact');
const contactModalCloseBtn = document.getElementsByClassName('closeBtn')[0];
const contactModalCloseBtnMain = document.querySelector('.contact-modal__body button.btn-locked-open');

contactModalActivateBtn.addEventListener('click', openModal);
contactModalCloseBtn.addEventListener('click', closeModal);
contactModalCloseBtnMain.addEventListener('click', closeModal);
// listen to outside click
window.addEventListener('click', outsideClick);

// Function to open modal
function openModal(){
    contactModal.style.display = 'block';
}
// Function to close modal
function closeModal(){
    contactModal.style.display = 'none';
}
// function to close modal if outside click
function outsideClick(e) {
    if(e.target == contactModal){
        contactModal.style.display = 'none';
    }
}

const copyDate = document.getElementById('date');
copyDate.innerHTML = new Date(Date.now()).getFullYear();