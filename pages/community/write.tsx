import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import Textarea from "../../components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className="px-4 py-10">
        <Textarea
          label="Question"
          name="question"
          placeholder="Ask a question!"
        />

        <Button text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
