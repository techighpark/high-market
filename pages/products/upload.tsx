/* eslint-disable jsx-a11y/alt-text */
import type { NextPage } from "next";
import Button from "@components/button";
import Input, { Kind } from "@components/input";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "@prisma/client";
import Image from "next/image";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutationResult {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const [photoPreview, setPhotoPreview] = useState("");
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { data, loading }] =
    useMutation<UploadProductMutationResult>("/api/products");
  const onValid = async ({
    name,
    price,
    description,
    photo,
  }: UploadProductForm) => {
    if (loading) return;
    const { uploadURL } = await (await fetch(`/api/files`)).json();
    const form = new FormData();
    form.append("file", photo[0], name);
    const {
      result: { id },
    } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
    uploadProduct({ name, price, description, photoId: id });
  };

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);

  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [watch, photo]);

  return (
    <Layout canGoBack title="Upload Item" seoTitle="Upload Item">
      <form
        className="flex flex-col items-center justify-center space-y-4 px-4 pb-20"
        onSubmit={handleSubmit(onValid)}
      >
        <div className="relative aspect-square w-3/5">
          {photoPreview ? (
            <>
              <Image
                src={photoPreview}
                layout="fill"
                className="rounded-md object-cover"
              />
              <span
                onClick={() => setPhotoPreview("")}
                className="absolute right-3 top-2 cursor-pointer text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </>
          ) : (
            <label className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          name="name"
          label="Name"
          type="text"
          kind={Kind.text}
          required
        />
        <Input
          register={register("price", { required: true })}
          name="price"
          label="Price"
          type="number"
          kind={Kind.price}
          placeholder="0.00"
          required
        />
        <Textarea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={loading ? "Loading..." : "Upload Item"} />
      </form>
    </Layout>
  );
};

export default Upload;
