import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import helloModule from "./modules/helloModule";
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
