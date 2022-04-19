import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout canGoBack seoTitle="Liked Items">
      <div className="flex flex-col space-y-5">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;
