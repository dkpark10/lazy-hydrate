import Image from "next/image";
import dynamic from "next/dynamic";
import LazyHydrate from "../components/react-lazy-hydrate";

const DynamicExpensiveComponent = dynamic(
  () => import('@/components/expensive-component'),
);

export const getServerSideProps = async (req) => {
  const { visible } = req.query;
  const data = await new Promise((resolve) => {
    resolve(Array.from({ length: 12 }, (_, idx) => idx));
  });

  return {
    props: {
      data,
      visible: visible ?? false,
    },
  };
};

/** @param { {data: number[]} } */
export default function Index({ data, visible }) {
  return (
    <main>
      <h1>
        event: {visible ? 'intersect' : 'touchstart, mouseenter'}
      </h1>
      <LazyHydrate
        whenVisible={visible}
        on={!visible && ['touchstart', 'mouseenter']}
        didHydrate={() => console.log("hydrated")}
      >
        <DynamicExpensiveComponent data={data} />
      </LazyHydrate>
      {data?.map((item) => (
        <div key={item} style={{ height: 140 }}>
          {item + 1}
        </div>
      ))}
      <Image src="/mangom.jpg" width={100} height={100} alt="망곰 이미지" />
    </main>
  );
}