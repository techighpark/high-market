import type { NextPage } from "next";
import Item from "@components/item";

const Loved: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5">
      {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <Item
          id={i}
          key={i}
          title={"iPhone 14"}
          price={99}
          comments={1}
          hearts={1}
        />
      ))}
    </div>
  );
};

export default Loved;
