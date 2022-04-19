import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";

export default function Blog() {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="text-lg font-semibold">Latest Post: </h1>
      <ul>
        <li>Welcome Everyone!</li>
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  readdirSync("./posts").forEach(file => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    console.log(content);
  });
  return {
    props: {},
  };
}
