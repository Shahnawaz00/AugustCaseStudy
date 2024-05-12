import './marketing-spend-chart.js';
import './market-share-chart.js';
import './challenges-chart.js';
import './website-traffic-chart.js';

window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;
    let landingImage = document.getElementById('landing-image');
    let header = document.getElementById('header-content');

    // slide away header content 
    let slideDistance = Math.min(scrollPosition, 500);
    header.style.transform = `translateY(-${slideDistance}px)`;

    // make image opaque 
    let opacity = 1 - (scrollPosition / windowHeight);
    header.style.opacity = opacity < 0 ? 0 : opacity;

    let landingImageOpacity = 1 - (scrollPosition / windowHeight);
    landingImage.style.opacity = landingImageOpacity < 0 ? 0 : landingImageOpacity;

    // lift image
    let liftDistance = Math.min((scrollPosition - windowHeight * 0.2) * 0.5, 200);
    landingImage.style.transform = `translateY(-${liftDistance}px)`;

});
