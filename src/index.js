import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Marquee3k from "marquee3000";
import LocomotiveScroll from "locomotive-scroll";
import swiperSliders from "./modules/swiperSliders";
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
    gsap.registerPlugin(SplitText);
    gsap.registerPlugin(ScrollTrigger);

    const locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
            lerp: 0.1,
            duration: 1.2,
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            normalizeWheel: true,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        },
    });

    const lenisInstance = locomotiveScroll.lenisInstance;

    let scrollPosition = lenisInstance.targetScroll;

    Marquee3k.init({
        selector: "marquee",
    });

    // Modules
    swiperSliders();
    let marqueeTranslate = 0;
    let minTranslate = 0;
    let maxTranslate = -100;
    let previousScrollY = 0;
    let currentScrollY = 0;
    let isScrollingUp = false;
    let timer;

    window.addEventListener("scroll", function (e) {
        currentScrollY = window.scrollY || document.documentElement.scrollTop;

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

    if (!isMobile.any()) {
        gsap.to(".team_image-wrapper", {
            scrollTrigger: {
                trigger: ".team_image-wrapper",
                start: "top+=20px top",

                end: () =>
                    window.innerWidth <= 1440
                        ? "bottom-=40px top"
                        : "bottom-=120px top", // Adjust based on screen width
                pin: true,
                pinSpacing: false,
                scrub: true,
                markers: false, // Show debug markers on the page
            },
        });
    }

    const mobileToggle = document.querySelector(".nav_mobile");
    if (mobileToggle) {
        const mobileNavScreen = document.querySelector(".nav_mobile-screen");
        const navLinks = mobileNavScreen.querySelectorAll(".nav_mobile-link");

        const navLinksReversed = [...navLinks].reverse();
        mobileToggle.addEventListener("click", function () {
            if (mobileNavScreen.classList.contains("open")) {
                navLinksReversed.forEach((link, index) => {
                    link.querySelector(".mobile-link-overlay").style.transform =
                        "translateY(0)";
                });

                setTimeout(() => {
                    mobileToggle.classList.remove("open");
                    mobileNavScreen.classList.remove("open");
                }, 300);
            } else {
                mobileToggle.classList.add("open");
                mobileNavScreen.classList.add("open");

                setTimeout(() => {
                    navLinks.forEach((link, index) => {
                        link.querySelector(
                            ".mobile-link-overlay"
                        ).style.transform = "translateY(100%)";
                    });
                }, 350);
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

    const textsSlidesUp = document.querySelectorAll(".js-text-slides-up");

    function animateTextSlideUp(wrapper) {
        wrapper.forEach((item) => {
            const btnHeight = item.clientHeight;
            const textTop = item.querySelector(".js-text-top");
            const textBottom = item.querySelector(".js-text-bottom");

            const splitTop = new SplitText(textTop, { type: "words" });
            const splitBottom = new SplitText(textBottom, { type: "words" });

            gsap.from(splitTop.words, {
                y: btnHeight,
                duration: 0.5,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
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
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
            if (!isMobile.any()) {
                item.addEventListener("mouseenter", () => {
                    gsap.to(item, {
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

    if (textsSlidesUp.length) {
        animateTextSlideUp(textsSlidesUp);
    }

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

    const newsHeader = document.querySelector(".news_head");
    const newsGrid = document.querySelector(".news_grid");

    if (newsHeader && newsGrid) {
        const newsItems = document.querySelectorAll(
            ".news_collection-list-item"
        );
        const newsFilterWrapper = document.querySelector(
            ".news_category-filter"
        );

        if (newsItems.length) {
            newsItems.forEach((item, index) => {
                const space = document.createElement("div");
                if ((index + 1) % 3 === 0) {
                    item.insertAdjacentElement("afterend", space);
                }
            });
        }

        function adjustNewsGridMargin() {
            if (window.innerWidth >= 992) {
                newsGrid.style.marginTop = `-${newsHeader.clientHeight}px`;
                newsFilterWrapper.style.marginTop = `${newsHeader.clientHeight}px`;
            } else {
                newsGrid.style.marginTop = "";
                newsFilterWrapper.style.marginTop = "";
            }

            locomotiveScroll.resize();
        }
        adjustNewsGridMargin();
        window.addEventListener("resize", adjustNewsGridMargin);
    }

    const newsFilters = document.querySelectorAll(".news_category-list-item");

    const newsItems = document.querySelectorAll(".news_collection-list-item");
    if (newsFilters.length && newsItems.length) {
        newsFilters.forEach((btn) => {
            btn.addEventListener("click", function () {
                const value = this.getAttribute("data-news-filter");
                if (value !== "All") {
                    newsItems.forEach((item) => {
                        item.style.display = "none";
                        const catsWrapper = item.querySelector(
                            ".news_list-item-category-item"
                        );
                        if (catsWrapper) {
                            const wrapperText =
                                catsWrapper.textContent ||
                                catsWrapper.innerText; // Get the text inside the div
                            if (wrapperText.includes(value)) {
                                item.style.display = "block";
                            }
                        }
                    });
                } else {
                    newsItems.forEach((item) => {
                        item.style.display = "block";
                    });
                }

                locomotiveScroll.resize();
            });
        });
    }

    const latestNewsItems = document.querySelectorAll(
        ".other-news_collection-list-item"
    );

    if (latestNewsItems.length) {
        const cloneSpacer = latestNewsItems[0].cloneNode();
        cloneSpacer.classList.add("cloned");

        cloneSpacer.classList.remove("js-cursor-read");
        latestNewsItems[0].insertAdjacentElement("afterend", cloneSpacer);
    }
    const readHovers = document.querySelectorAll(".js-cursor-read");

    const cursorRead = document.querySelector(".cursor_read");

    if (readHovers.length && cursorRead) {
        // Smoothly move the cursor using GSAP
        window.addEventListener("mousemove", (e) => {
            gsap.to(cursorRead, {
                x: e.clientX,
                y: e.clientY + currentScrollY,
                duration: 0.2,
                ease: "power3.out",
            });
        });

        // Show cursor on hover
        readHovers.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                gsap.to(cursorRead, {
                    scale: 1,
                    autoAlpha: 1, // make it visible
                    duration: 0.3,
                    ease: "power3.out",
                    delay: 0.2,
                });
            });

            item.addEventListener("mouseleave", () => {
                gsap.to(cursorRead, {
                    scale: 0,
                    autoAlpha: 0, // hide the cursor
                    duration: 0.3,
                    ease: "power3.out",
                });
            });
        });
    }
    const currentYear = new Date().getFullYear();
    $(`[data="year"]`).html(currentYear);
});
