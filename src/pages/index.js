import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense, lazy } from "react";
import LazyHydrate from "../components/react-lz-hydrate";

const DynamicExpensiveComponent = dynamic(() =>
  import("@/components/expensive-component")
);

const LazyExpensiveComponent = lazy(() =>
  import("@/components/expensive-component")
);

const DynamicComponent = dynamic(() =>
  import("@/components/dynamic-component")
);

export const getServerSideProps = async (req) => {
  const { mode, visible } = req.query;
  const data = await new Promise((resolve) => {
    resolve(Array.from({ length: 12 }, (_, idx) => idx));
  });

  return {
    props: {
      data,
      mode: mode || "dynamic",
      visible: visible ?? false,
    },
  };
};

/** @param { {data: number[]} } */
export default function PageLazy({ data, mode, visible }) {
  return (
    <main>
      <LazyHydrate
        whenVisible={visible}
        on={!visible && ["touchstart", "mouseenter"]}
        didHydrate={() => console.log("hydrated")}
      >
        {mode === "dynamic" ? (
          <DynamicExpensiveComponent data={data} />
        ) : (
          <Suspense
            fallback={
              <>
                {data.map((d) => (
                  <div key={d}>Slide {d}</div>
                ))}
              </>
            }
          >
            <LazyExpensiveComponent data={data} />
          </Suspense>
        )}
      </LazyHydrate>
      {data?.map((item) => (
        <div key={item} style={{ height: 140 }}>
          {item + 1}
        </div>
      ))}
      <DynamicComponent />
      <Image src="/mangom.jpg" width={100} height={100} alt="망곰 이미지" />
    </main>
  );
}
