import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
  });

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      console.log("mutation finished", data);
    },
  });

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: submit the form data to the backend
    generateIcon.mutate({
      prompt: form.prompt,
    });
  }

  function updateform(key: string) {
    // a higher order function
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }
  const session = useSession();
  const isLoggedIn = !!session.data;
  return (
    <>
      <Head>
        <title>Generate</title>
        <meta name="description" content="Generate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {!isLoggedIn && (
          <Button
            onClick={() => {
              signIn().catch(console.error);
            }}
          >
            Login
          </Button>
        )}
        {isLoggedIn && (
          <Button
            onClick={() => {
              signOut().catch(console.error);
            }}
          >
            Logout
          </Button>
        )}
        {session.data?.user?.name}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <FormGroup>
            <label>Prompt</label>
            <Input value={form.prompt} onChange={updateform("prompt")}></Input>
            <Button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">
              Submit
            </Button>
          </FormGroup>
        </form>
      </main>
    </>
  );
};

export default GeneratePage;
