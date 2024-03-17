import { Swiper, SwiperSlide } from "swiper/react";
import * as cheerio from "cheerio";

export default function LazySwiper() {
  const $ = cheerio.load('<div>Slide</div>');

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
    >
      <SwiperSlide>{$('div').text()} 1</SwiperSlide>
      <SwiperSlide>{$('div').text()} 2</SwiperSlide>
      <SwiperSlide>{$('div').text()} 3</SwiperSlide>
      <SwiperSlide>{$('div').text()} 4</SwiperSlide>
    </Swiper>
  );
}
