import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Marquee3k from "marquee3000";
import helloModule from "./modules/helloModule";
import LocomotiveScroll from "locomotive-scroll";

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return (
            navigator.userAgent.match(/IEMobile/i) ||
            navigator.userAgent.match(/WPDesktop/i)
        );
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
        );
    },
};

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

        const maxTranslateVW = -20; // Maximum translation value in vw
        const translateValueScroll = maxTranslateVW * progress;

        target.style.transform = `translate3d(${translateValueScroll}vw, 0px, 0px)`;
    });

    window.addEventListener("smushHeroImage", (e) => {
        const { target, progress } = e.detail;

        if (progress > 0) {
            target.style.scale = "none";
            target.style.transform = `translate3d(0px, 0px, 0px) scale(1, ${
                1 + progress
            })`;
            target.style.transformOrigin = "top";
            target.style.translate = "none";
            target.style.rotate = "none";
        }
    });

    window.addEventListener("smushFooterImage", (e) => {
        const { target, progress } = e.detail;

        if (progress > 0) {
            target.style.scale = "none";
            target.style.transform = `translate3d(0px, 0px, 0px) scale(1, ${
                1 - progress
            })`;
            target.style.transformOrigin = "bottom";
            target.style.translate = "none";
            target.style.rotate = "none";
        }
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
            trigger: ".team_image-wrapper",
            start: "top+=80px top",
            end: "bottom +=80px top",
            pin: true,
            pinSpacing: false,
            scrub: true,
            markers: false, // Show debug markers on the page
        },
    });

    const mobileToggle = document.querySelector(".nav_mobile");
    if (mobileToggle) {
        const mobileNavScreen = document.querySelector(".nav_mobile-screen");
        const navLinks = mobileNavScreen.querySelectorAll(".nav_mobile-link");

        const navLinksReversed = [...navLinks].reverse();
        mobileToggle.addEventListener("click", function () {
            if (mobileNavScreen.classList.contains("open")) {
                navLinksReversed.forEach((link, index) => {
                    setTimeout(() => {
                        link.querySelector(
                            ".mobile-link-overlay"
                        ).style.transform = "translateY(0)";
                    }, 250 * index); // Increment delay for each item
                });

                setTimeout(() => {
                    mobileToggle.classList.remove("open");
                    mobileNavScreen.classList.remove("open");
                }, 250 * navLinksReversed.length);
            } else {
                mobileToggle.classList.add("open");
                mobileNavScreen.classList.add("open");

                setTimeout(() => {
                    navLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.querySelector(
                                ".mobile-link-overlay"
                            ).style.transform = "translateY(100%)";
                        }, 250 * index); // Increment delay for each item
                    });
                }, 250);
            }
        });
    }

    const contactSmushImages = document.querySelectorAll(".contact_image");

    if (contactSmushImages.length) {
        let smushParam = 1;
        let smushDirection = 1;
        const smushTimer = setInterval(() => {
            smushParam += smushDirection * 0.01;

            // Reverse direction if smushParam reaches the bounds
            if (smushParam >= 2.25) {
                smushDirection = -1; // Start decreasing
            } else if (smushParam <= 1) {
                smushDirection = 1; // Start increasing
            }

            contactSmushImages.forEach((img) => {
                img.style.scale = "none";
                img.style.transform = `translate3d(0px, 0px, 0px) scale(1, ${smushParam})`;
                img.style.transformOrigin = "top";
                img.style.translate = "none";
                img.style.rotate = "none";
            });
        }, 20);

        window.addEventListener("beforeunload", () => {
            clearInterval(smushTimer);
        });
    }
    // Animation

    const teamItems = document.querySelectorAll(".team_item-wrapper");

    if (teamItems.length) {
        teamItems.forEach((item) => {
            const btn = item.querySelector(".js-text-slides-up");
            const btnHeight = btn.clientHeight;
            const textTop = btn.querySelector(".js-text-top");
            const textBottom = btn.querySelector(".js-text-bottom");

            const splitTop = new SplitText(textTop, { type: "words" });
            const splitBottom = new SplitText(textBottom, { type: "words" });

            gsap.from(splitTop.words, {
                y: btnHeight,
                duration: 0.5,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: btn,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
            gsap.from(splitBottom.words, {
                y: textTop.clientHeight,
                duration: 0.5,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: btn,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
            if (!isMobile.any()) {
                item.addEventListener("mouseenter", () => {
                    gsap.to(btn, {
                        width: textBottom.clientWidth,
                        duration: 0.5,
                        ease: "linear",
                    });

                    gsap.to(splitTop.words, {
                        y: "-" + (btnHeight + 5),
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    });

                    // Translate bottom line upwards to the position of the top line
                    gsap.to(splitBottom.words, {
                        y: "-" + (btnHeight + 5),
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    });
                });

                item.addEventListener("mouseleave", () => {
                    // Reset top line to its original position
                    gsap.to(splitTop.words, {
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    });

                    // Reset bottom line to its original position
                    gsap.to(splitBottom.words, {
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    });
                });
            }
        });
    }

    const buttonHovers = document.querySelectorAll(".js-button-hover");

    if (buttonHovers.length) {
        buttonHovers.forEach((btn) => {
            const wrapperDiv = document.createElement("div");

            wrapperDiv.style.overflow = "hidden";
            wrapperDiv.style.height = btn.clientHeight + "px";
            // Clone the button to make a second copy
            const clonedBtn = btn.cloneNode(true);

            // Append the original button and the cloned button to the div
            wrapperDiv.appendChild(btn.cloneNode(true)); // Append original button
            wrapperDiv.appendChild(clonedBtn); // Append cloned button

            // Replace the original button in the DOM with the new div
            btn.replaceWith(wrapperDiv);

            wrapperDiv.addEventListener("mouseenter", function () {
                const lines = wrapperDiv.querySelectorAll(".js-button-hover");

                // Animate the first button out of view (push up)
                gsap.to(lines[0], {
                    y: -parseInt(wrapperDiv.clientHeight), // Move up by the button's height
                    duration: 0.5,
                    ease: "power2.out",
                });

                gsap.to(lines[1], {
                    y: -parseInt(wrapperDiv.clientHeight), // Move to the initial position (from below)
                    duration: 0.5,
                    ease: "power2.out",
                });
            });

            wrapperDiv.addEventListener("mouseleave", function () {
                const lines = wrapperDiv.querySelectorAll(".js-button-hover");

                // Reset both elements back to their original positions
                gsap.to(lines[0], {
                    y: 0, // Reset the original button
                    duration: 0.5,
                    ease: "power2.out",
                });
                gsap.to(lines[1], {
                    y: btn.clientHeight, // Move the cloned button down
                    duration: 0.5,
                    ease: "power2.out",
                });
            });
        });
    }

    const revealTitles = document.querySelectorAll(".js-reveal-title");

    if (revealTitles.length) {
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

    // Floating labels

    document.querySelectorAll(".input, .input-area").forEach(function (input) {
        input.addEventListener("input", function () {
            if (input.value.trim() !== "") {
                input.classList.add("has-value");
            } else {
                input.classList.remove("has-value");
            }
        });

        // Ensure the class is set on page load if the input has a value
        if (input.value.trim() !== "") {
            input.classList.add("has-value");
        }
    });

    const currentYear = new Date().getFullYear();
    $(`[data="year"]`).html(currentYear);
});
