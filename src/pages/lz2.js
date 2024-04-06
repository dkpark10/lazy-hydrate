import Image from "next/image";
import LazyHydrate from "../components/react-lz-hydrate";
import dynamic from "next/dynamic";

const ExpensiveComponent = dynamic(() =>
  import("@/components/expensive-component")
);

export const getServerSideProps = async () => {
  const data = await new Promise((resolve) => {
    resolve(Array.from({ length: 12 }, (_, idx) => idx));
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
      <Image src="/mangom.jpg" width={100} height={100} alt="망곰 이미지" />
      <LazyHydrate on="touchstart" didHydrate={() => console.log("hydrated")}>
        <ExpensiveComponent data={data} />
      </LazyHydrate>
      {data?.map((item) => (
        <div key={item} style={{ height: 140 }}>
          {item + 1}
        </div>
      ))}
    </main>
  );
}
