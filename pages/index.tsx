import type { NextApiRequest, NextPage, NextPageContext } from "next";
import FloatingButton from "@components/floatingButton";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Fav, Product, Progress } from "@prisma/client";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import useUser from "@libs/client/useUser";

export interface ProductWitFav extends Product {
  _count: { favs: number };
  favs: Fav[];
  progress?: Progress;
}
interface ProductResponse {
  ok: boolean;
  products: ProductWitFav[];
}

const Home: NextPage = () => {
  const { user } = useUser();
  const { data, error } = useSWR<ProductResponse>("/api/products");

  return (
    <Layout title="Home" hasTabBar seoTitle="Home">
      <div className="flex flex-col space-y-5 ">
        {data?.products?.map(product => (
          <Item
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            img={product.image}
            comments={1}
            state={product.progress?.state}
            isLiked={Boolean(
              product.favs?.map(fav => fav.userId).includes(user?.id!)
            )}
            hearts={product._count?.favs || 0}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ products: ProductWitFav[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  console.log("SSR INDEX");
  const products = await client.product.findMany({
    where: {
      userId: {
        not: req?.session?.user?.id,
      },
    },
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
});

export default Page;
