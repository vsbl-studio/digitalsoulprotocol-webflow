import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

export default function () {
    Swiper.use([Navigation]);
    const gallerySwiper = document.querySelector(".js-gallery-swiper");

    if (gallerySwiper) {
        const gallerySwiperInstance = new Swiper(gallerySwiper, {
            slidesPerView: 1,
            spaceBetween: 32,

            loop: false,
            navigation: {
                nextEl: ".js-gallery-next",
                prevEl: ".js-gallery-prev",
            },
        });
    }
}
