(function () {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all);
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener));
            } else {
                selectEl.addEventListener(type, listener);
            }
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener);
    }

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header');
        let offset = header.offsetHeight;

        let elementPos = select(el).offsetTop;
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        });
    }

    /**
   * Porfolio isotope and filter
   */
    window.addEventListener('load', () => {
        let portfolioContainer = select('.portfolio-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item'
            });

            let portfolioFilters = select('#portfolio-flters li', true);

            on('click', '#portfolio-flters li', function (e) {
                e.preventDefault();
                portfolioFilters.forEach(function (el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                portfolioIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                portfolioIsotope.on('arrangeComplete', function () {
                    AOS.refresh()
                });
            }, true);
        }

    });

    /**
     * Initiate portfolio lightbox 
     */
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox'
    });

    /**
     * Initiate portfolio details lightbox 
     */
    const portfolioDetailsLightbox = GLightbox({
        selector: '.portfolio-details-lightbox',
        width: '90%',
        height: '90vh'
    });

    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 30000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        zoom: {
            enabled: true,
            maxRatio: 2
        }
    });

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top');
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active');
            } else {
                backtotop.classList.remove('active');
            }
        }
        window.addEventListener('load', toggleBacktotop);
        onscroll(document, toggleBacktotop);
    }

    /**
     * Nav menu
     */
    on('click', '.navbar > ul > li > a', function (e) {
        let navbar = select('#navbar');
        if (navbar.classList.contains('navbar-mobile')) {
            navbar.classList.toggle('navbar-mobile');
            let navbarToggle = select('.mobile-nav-toggle');
            navbarToggle.classList.toggle('bi-list');
            navbarToggle.classList.toggle('bi-x');
        }

        let menues = select("#navbar ul li a", true);
        menues.forEach(function (menu) {
            menu.classList.remove('active');
        });

        this.classList.add('active');

        scrollto(`#${this.dataset.menu}`);

    }, true);

    /**
     * Mobile nav toggle menu
     */
    on('click', '.mobile-nav-toggle', function (e) {
        select('#navbar').classList.toggle('navbar-mobile');
        this.classList.toggle('bi-list');
        this.classList.toggle('bi-x');
        console.log("mobile-nav-toggle");
    });

    on('click', '#aboutBtn', function (e) {
        scrollto('#about');
    });

    /**
     * Run code when document is ready
     */
    document.addEventListener('DOMContentLoaded', function () {
        //credits to https://medium.com/p1xts-blog/scrollspy-with-just-javascript-3131c114abdc
        // grab the sections (targets) and menu_links (triggers)
        // for menu items to apply active link styles to
        const sections = document.querySelectorAll("main section");
        const menu_links = document.querySelectorAll("nav ul li a");

        // functions to add and remove the active class from links as appropriate
        const makeActive = (link) => menu_links[link].classList.add("active");
        const removeActive = (link) => menu_links[link].classList.remove("active");
        const removeAllActive = () => [...Array(sections.length).keys()].forEach((link) => removeActive(link));

        // change the active link a bit above the actual section
        // this way it will change as you're approaching the section rather
        // than waiting until the section has passed the top of the screen
        const sectionMargin = 200;

        // keep track of the currently active link
        // use this so as not to change the active link over and over
        // as the user scrolls but rather only change when it becomes
        // necessary because the user is in a new section of the page
        let currentActive = 0;

        // listen for scroll events
        window.addEventListener("scroll", () => {

            // check in reverse order so we find the last section
            // that's present - checking in non-reverse order would
            // report true for all sections up to and including
            // the section currently in view
            //
            // Data in play:
            // window.scrollY    - is the current vertical position of the window
            // sections          - is a list of the dom nodes of the sections of the page
            //                     [...sections] turns this into an array so we can
            //                     use array options like reverse() and findIndex()
            // section.offsetTop - is the vertical offset of the section from the top of the page
            // 
            // basically this lets us compare each section (by offsetTop) against the
            // viewport's current position (by window.scrollY) to figure out what section
            // the user is currently viewing
            const current = sections.length - [...sections].reverse().findIndex((section) => window.scrollY >= section.offsetTop - sectionMargin) - 1

            // only if the section has changed
            // remove active class from all menu links
            // and then apply it to the link for the current section
            if (current !== currentActive) {
                removeAllActive();
                currentActive = current;
                makeActive(current);
            }
        });
    }, false);
})();