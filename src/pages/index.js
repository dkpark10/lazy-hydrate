import Image from 'next/image';
import dynamic from "next/dynamic";
import Parent from '@/components/parent';

const DynamicComponent = dynamic(() => import("@/components/dynamic-component"));

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
      {data?.map((item) => (
        <div key={item} style={{ height: 140 }}>
          {item + 1}
        </div>
      ))}
      <DynamicComponent />
      <Image src="/mangom.jpg" width={100} height={100} alt="망곰 이미지" />
      <Parent />
    </main>
  );
}
