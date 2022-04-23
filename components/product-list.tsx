import { ProductWitFav } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListPorps {
  kind: "favs" | "sales" | "purchases";
}

interface Record {
  id: number;
  product: ProductWitFav;
}
interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListPorps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map(record => (
        <Item
          key={record.id}
          id={record.product.id}
          img={record.product.image}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          isLiked={false}
          state={record?.product?.progress?.state}
          hearts={record.product._count.favs}
        />
      ))}
    </>
  ) : null;
}
