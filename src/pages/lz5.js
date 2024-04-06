import Image from "next/image";
import ExpensiveComponent from "@/components/expensive-component";

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
      <ExpensiveComponent data={data} />
      {data?.map((item) => (
        <div key={item} style={{ height: 140 }}>
          {item + 1}
        </div>
      ))}
    </main>
  );
}
