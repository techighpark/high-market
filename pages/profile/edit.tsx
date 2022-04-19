/* eslint-disable jsx-a11y/alt-text */
import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import Image from "next/image";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const [avatarPreview, setAvatarPreview] = useState("");
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email or Phone number are required.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      // ask for CF URL
      // upload file to CF URL

      const cloudflareRequest = await fetch(`/api/files`);
      const { uploadURL } = await cloudflareRequest.json();
      const form = new FormData();
      form.append("file", avatar[0], user?.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };
  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${user?.avatar}/avatar`
      );
  }, [setValue, user]);
  // useEffect(() => {
  //   if (data && !data.ok && data.error) {
  //     setError("formErrors", { message: data.error });
  //   }
  // }, [data, setError]);
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  return (
    <Layout canGoBack seoTitle="Edit Profile">
      <div className="px-4">Hello, {user?.name}</div>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-5 px-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <Image
              height={112}
              width={112}
              src={avatarPreview}
              className="h-28 w-28 rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", {
            onChange: () => {
              clearErrors("formErrors");
            },
          })}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email", {
            onChange: () => {
              clearErrors("formErrors");
            },
          })}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone", {
            onChange: () => {
              clearErrors("formErrors");
            },
          })}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors && errors.formErrors ? (
          <span className="my-2 block pt-4 text-center text-xs font-medium text-red-500">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
