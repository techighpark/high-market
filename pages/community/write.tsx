import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCoords from "@libs/client/useCoords";

interface WriteResponse {
  ok: boolean;
  post: Post;
}

interface WriteForm {
  question: string;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();

  const { register, handleSubmit } = useForm<WriteForm>();

  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");

  const onValid = (form: WriteForm) => {
    if (loading) return;
    post({ ...form, latitude, longitude });
  };

  const router = useRouter();
  useEffect(() => {
    if (data && data.ok) {
      router.replace(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write" seoTitle="Write">
      <form className="px-4 py-4" onSubmit={handleSubmit(onValid)}>
        <Textarea
          register={register("question", { required: true, minLength: 5 })}
          label="Question"
          name="question"
          placeholder="Ask a question!"
        />

        <Button text={loading ? "Loading" : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
