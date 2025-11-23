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

const desktopScrollHeight = 56; // 1 times the scrollHeight of the nav-link on a steady state
const mobileScrollHeight = 380; // 6 times the scrollHeight of the nav-link on a steady state

var mediaWidth1010px = window.matchMedia("(min-width: 1010px)");

btnNavToggle.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.classList.toggle('show-links');
    btnNavToggle.classList.toggle('nav-toggled');

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

// Preview Video play (mp4) on mouse hover
const videoClips = document.querySelectorAll('.video-clip');
videoClips.forEach( clip => {
    clip.addEventListener("mouseover", function( event ) { 
        event.target.play();
    });

    clip.addEventListener("mouseout", function( event ) { 
        event.target.pause();
    });
});

// PhotoSwipe Code
var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            // CHANGE: EXCLUDE H1 elements!
            if(figureEl.nodeType !== 1 || figureEl.nodeName == "H1") {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
             // CHANGE: EXCLUDE H1 elements!
            if(childNodes[i].nodeType !== 1 || childNodes[i].nodeName == "H1") { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }nj

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    // CHANGE: remove all child elements of photo-swipe gallery node that are not figure nodes
    // galleryElements.forEach( (elem) => {
    //     for (const child of elem.children){
    //         console.log(`nodeName: ${child.nodeName}`);
    //         if(child.nodeName != "FIGURE"){
    //             child.remove();
    //         }
    //     }
    // });


    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.photoswipe-gallery');

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