import { type NextPage } from "next";
import Head from "next/head";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";

const GeneratePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Generate</title>
        <meta name="description" content="Generate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <FormGroup>
          <label>Prompt</label>
          <Input></Input>
          <button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">
            Submit
          </button>
        </FormGroup>
      </main>
    </>
  );
};

export default GeneratePage;
