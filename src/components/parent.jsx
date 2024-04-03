import dynamic from "next/dynamic";
import LazyHydrate from "./react-lz-hydrate";

const ExpensiveComponent = dynamic(() =>
  import("@/components/expensive-component")
);

export default function Parent() {
  return (
    <LazyHydrate whenVisible didHydrate={() => console.log('hydrated')}>
      <ExpensiveComponent />
    </LazyHydrate>
  );
}
