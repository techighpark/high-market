import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateForm>();
  const [createStream, { data, loading }] =
    useMutation<CreateResponse>("/api/streams");
  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Stream" seoTitle="Stream Your Item">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-5 px-4 py-10">
        <Input
          register={register("name", { required: true })}
          required
          type="text"
          label="Name"
          name="name"
          kind="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <Textarea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />

        <Button text={loading ? "Loading..." : "Go Live"} />
      </form>
    </Layout>
  );
};

export default Create;
