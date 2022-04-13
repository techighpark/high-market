import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import Textarea from "../../components/textarea";

const Create: NextPage = () => {
  return (
    <Layout canGoBack title="Stream">
      <div className=" space-y-5 px-4">
        <Input required label="Name" name="name" kind="text" />
        <Input
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <Textarea name="description" label="Description" />

        <Button text="Go Live" />
      </div>
    </Layout>
  );
};

export default Create;
