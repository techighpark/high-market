/* eslint-disable jsx-a11y/alt-text */
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import router, { useRouter } from "next/router";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import { useEffect } from "react";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductDetailResponse {
  // ok: boolean;
  products: ProductWithUser;
  similartProducts: Product[];
  isLiked: boolean;
}

export const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  // const { mutate } = useSWRConfig();
  const { data, mutate: boundMutation } = useSWR<ProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [openChat, { data: chatData }] = useMutation(`/api/chats`);
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);

  const onFavClick = () => {
    if (!data) return;
    // boundMutation({ ...data, isLiked: !data.isLiked }, false);
    boundMutation(prev => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };

  // if (router.isFallback) {
  //   return (
  //     <Layout title="Loading for you" seoTitle="...Loading">
  //       <span>Loding this page !</span>
  //     </Layout>
  //   );
  const onTalkClick = () => {
    openChat(router.query);
  };
  useEffect(() => {
    if (chatData?.ok) {
      router.push(`/chats/${chatData.chatRoom.id}`);
    }
  }, [chatData, router]);

  return (
    <Layout title="Item" canGoBack seoTitle={data?.products?.name + "'s Item"}>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="= relative flex aspect-square w-full">
            <Image
              src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${data?.products?.image}/public`}
              // width={350}
              // height={350}
              priority
              layout="fill"
              className=" w-full rounded-md object-cover"
            />
          </div>
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3 ">
            <Image
              src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${data?.products?.user?.avatar}/avatar`}
              className="h-12 w-12 rounded-full bg-slate-300"
              width={48}
              height={48}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.products?.user.name}
              </p>
              <Link href={`/users/profiles/${data?.products?.user.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5 w-full">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.products?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              ${data?.products?.price}
            </span>
            <p className="my-6 text-base text-gray-700">
              {data?.products?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button text="Talk to seller" lg onClick={onTalkClick} />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
                  data?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 ">
            {data?.similartProducts?.map(product => (
              <div key={product.id}>
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    className="mb-4 bg-slate-300 object-cover"
                    layout="fill"
                    src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${product.image}/public`}
                  />
                </div>
                <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// export const getStaticPaths: GetStaticPaths = () => {
//   return {
//     paths: [],
//     fallback: true,
//   };
// };

// export const getStaticProps: GetStaticProps = async ctx => {
//   if (!ctx?.params?.id) {
//     return {
//       props: {},
//     };
//   }

//   const products = await client.product.findUnique({
//     where: {
//       id: +ctx.params.id.toString(),
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           avatar: true,
//         },
//       },
//     },
//   });

//   const terms = products?.name
//     .split(" ")
//     .map(term => ({ name: { contains: term } }));

//   const similartProducts = await client.product.findMany({
//     where: {
//       OR: terms,
//       AND: {
//         id: {
//           not: products?.id,
//         },
//       },
//     },
//   });

//   const isLiked = false;

//   if (!products) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//       similartProducts: JSON.parse(JSON.stringify(similartProducts)),
//       isLiked,
//     },
//   };
// };

const Page: NextPage<ProductDetailResponse> = ({
  products,
  similartProducts,
  isLiked,
}) => {
  const router = useRouter();
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/products/${router.query.id}`]: {
            ok: true,
            products,
            similartProducts,
            isLiked,
          },
        },
      }}
    >
      <ItemDetail />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function (
  ctx: GetServerSidePropsContext
) {
  const { id } = ctx?.params!;
  if (!id) return;
  const products = await client.product.findUnique({
    where: {
      id: +id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = products?.name
    .split(" ")
    .map(term => ({ name: { contains: term } }));

  const similartProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: products?.id,
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        userId: ctx?.req?.session?.user?.id,
        productId: products?.id,
      },
      select: {
        id: true,
      },
    })
  );

  if (!products) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      similartProducts: JSON.parse(JSON.stringify(similartProducts)),
      isLiked,
    },
  };
});

export default Page;
