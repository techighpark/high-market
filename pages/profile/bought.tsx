import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="flex flex-col space-y-5">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;
