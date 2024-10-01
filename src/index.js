import Lenis from "lenis";
import gsap, { selector } from "gsap";
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
        speed: -1,
    });

    let previousScrollY = 0;

    window.addEventListener("marqueeScrollEvent", (e) => {
        const { target, progress } = e.detail;

        const currentScrollY =
            window.scrollY || document.documentElement.scrollTop;
        const isScrollingUp = currentScrollY < previousScrollY;

        const maxTranslate = -10; // Maximum translation value in vw
        const translateValue = maxTranslate * progress;

        // Only update the marquee direction when the scrolling down
        if (!isScrollingUp) {
            target.style.transform = `translate3d(${translateValue}vw, 0px, 0px)`;
        }

        previousScrollY = currentScrollY;
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
