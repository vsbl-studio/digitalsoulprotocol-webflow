import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Marquee3k from "marquee3000";
import helloModule from "./modules/helloModule";
import LocomotiveScroll from "locomotive-scroll";

document.addEventListener("DOMContentLoaded", function () {
    helloModule();
    gsap.registerPlugin(SplitText);
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const locomotiveScroll = new LocomotiveScroll();

    Marquee3k.init({
        selector: "marquee",
    });

    let previousScrollY = 0;
    let isScrollingUp = false;
    let marqueeTranslate = 0;
    let minTranslate = 0;
    let maxTranslate = -100;
    let timer;

    window.addEventListener("scroll", function (e) {
        const currentScrollY =
            window.scrollY || document.documentElement.scrollTop;
        isScrollingUp = currentScrollY < previousScrollY;

        previousScrollY = currentScrollY;
    });
    function updateMarqueeTranslate() {
        const translateStep = 0.05;

        if (isScrollingUp) {
            marqueeTranslate += translateStep; // Move forward (increase)
        } else {
            marqueeTranslate -= translateStep; // Move backward (decrease)
        }

        if (marqueeTranslate > minTranslate) {
            marqueeTranslate = maxTranslate; // Reset to start position
        }
        if (marqueeTranslate < maxTranslate) {
            marqueeTranslate = minTranslate; // Reset to start position
        }
    }

    // Custom Locomotive Events
    window.addEventListener("marqueeScrollEvent", (e) => {
        const { target, progress } = e.detail;

        const maxTranslateVW = -10; // Maximum translation value in vw
        const translateValueScroll = maxTranslateVW * progress;

        target.style.transform = `translate3d(${translateValueScroll}vw, 0px, 0px)`;
    });

    window.addEventListener("smushFooterImage", (e) => {
        const { target, progress } = e.detail;

        const scaleValue = progress * 2;
        target.style.scale = "none";
        target.style.transform = `translate3d(0px, 0px, 0px) scale(1, ${
            scaleValue <= 1 ? scaleValue : 1
        })`;
        target.style.transformOrigin = "bottom";
        target.style.translate = "none";
        target.style.rotate = "none";
    });

    timer = setInterval(() => {
        updateMarqueeTranslate();

        const marqueeContents = document.querySelectorAll(".marquee-content");
        marqueeContents.forEach((line) => {
            line.style.transform = `translate3d(${marqueeTranslate}%, 0, 0)`;
        });
    }, 20);

    window.addEventListener("beforeunload", () => {
        clearInterval(timer);
    });

    gsap.to(".team_image-wrapper", {
        scrollTrigger: {
            trigger: ".team_image-wrapper", // The element you want to pin
            start: "top+=80px top", // Pin when the element's top reaches the top of the viewport
            end: "bottom top", // Unpin when the bottom of the element reaches the top of the viewport
            pin: true, // Enable pinning
            pinSpacing: false, // Prevent additional space after unpinning
            scrub: true, // Smooth pinning animation synced to scroll
            markers: true, // Optional: Show debug markers on the page (you can remove this)
        },
    });

    const revealTitles = document.querySelectorAll(".js-reveal-title");

    if (revealTitles) {
        revealTitles.forEach((title) => {
            const splitText = new SplitText(title, { type: "lines" });

            splitText.lines.forEach((line) => {
                const lineWrapper = document.createElement("div");
                lineWrapper.style.overflow = "hidden";
                line.parentNode.insertBefore(lineWrapper, line);
                lineWrapper.appendChild(line);
            });
            gsap.from(splitText.lines, {
                y: 75,
                duration: 1,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        });
    }
    const currentYear = new Date().getFullYear();
    $(`[data="year"]`).html(currentYear);
});
