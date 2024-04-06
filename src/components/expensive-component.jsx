import { Swiper, SwiperSlide } from "swiper/react";
import * as cheerio from "cheerio";

/** @param { {data: number[]} } */
export default function ExpensiveComponent({ data }) {
  const $ = cheerio.load("<div>Slide</div>");

  return (
    <Swiper spaceBetween={50} slidesPerView={3}>
      {data.map((d) => (
        <SwiperSlide key={d}>
          {$("div").text()} {d}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
