import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout canGoBack title="Sold Items" seoTitle={"Sold Items"}>
      <div className="flex flex-col space-y-5">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Sold;
