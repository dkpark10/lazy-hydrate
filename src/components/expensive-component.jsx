import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as cheerio from 'cheerio';

const images = [
  'https://via.placeholder.com/600/92c952',
  'https://via.placeholder.com/600/771796',
  'https://via.placeholder.com/600/24f355',
  'https://via.placeholder.com/600/d32776',
  'https://via.placeholder.com/600/f66b97',
  'https://via.placeholder.com/600/56a8c2',
  'https://via.placeholder.com/600/b0f7cc',
  'https://via.placeholder.com/600/54176f',
  'https://via.placeholder.com/600/51aa97',
  'https://via.placeholder.com/600/810b14',
  'https://via.placeholder.com/600/1ee8a4',
  'https://via.placeholder.com/600/66b7d2',
];

/** @param { {data: number[]} } */
export default function ExpensiveComponent({ data }) {
  const $ = cheerio.load('<div>Slide</div>');

  return (
    <Swiper spaceBetween={50} slidesPerView={3}>
      {data.map((d, idx) => (
        <SwiperSlide key={d}>
          <div style={{ fontSize: 25 }}>
            <Image src={images[idx]} alt="" width={200} height={200} />
            {$('div').text()} {d}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
