import LazyHydrate from "react-lazy-hydration";
// import LazyHydrate from "@/components/react-lz-hydrate";
import dynamic from "next/dynamic";

const LazySwiper = dynamic(() => import("@/components/lazy-component"));

export const getServerSideProps = async () => {
  const data = await new Promise((resolve) => {
    resolve(Array.from({ length: 80 }, (_, idx) => idx));
  });

  return {
    props: {
      data,
    },
  };
};


/** @param { {data: number[]} } */
export default function PageLazy({ data }) {
  return (
    <main>
      {data?.map((item) => (
        <div key={item} className="h-6">
          {item}
        </div>
      ))}
      <LazyHydrate whenVisible>
        <LazySwiper />
      </LazyHydrate>
    </main>
  );
}
