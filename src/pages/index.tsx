import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PrimaryLinkButton } from "~/component/PrimaryLinkButton";

function HeroBanner() {
  return (
    <section className="mb-24 mt-12 grid grid-cols-1 gap-12 px-8 sm:mt-24 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className="text-6xl">Create Cool Avatars and Icons Easily</h1>
        <p className="text-2xl">
          Looking for a quick avatar or icon? You're in the right place! With
          Avatar AI, you can make awesome avatars and icons in just a few
          clicks.
        </p>
        <PrimaryLinkButton href="/generate" className="self-start">
          Make Your Avatar
        </PrimaryLinkButton>
      </div>
      <Image
        src="/banner.png"
        alt="A showcase of various avatars and icons"
        width="500"
        height="500"
        className="order-first rounded-xl border-4 border-gray-200 sm:-order-none"
      />
    </section>
  );
}

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Avatar Generator</title>
        <meta
          name="description"
          content="Instantly create personalized avatars and icons with Avatar AI's advanced technology."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col">
        <HeroBanner />
      </main>
    </>
  );
};

export default HomePage;

// import { type NextPage } from "next";
// import Head from "next/head";
// import Image from "next/image";
// import { PrimaryLinkButton } from "~/component/PrimaryLinkButton";

// function HeroBanner() {
//   return (
//     <section className="mb-24 mt-12 grid grid-cols-1 gap-12 px-8 sm:mt-24 sm:grid-cols-2">
//       <div className="flex flex-col gap-4">
//         <h1 className="text-6xl">Effortless Icon Creation</h1>
//         <p className="text-2xl">
//           Discover the power of AI to instantly create unique icons, eliminating
//           the need for designers and long wait times.
//         </p>
//         <PrimaryLinkButton href="/generate" className="self-start">
//           Create Your Icon Now
//         </PrimaryLinkButton>
//       </div>
//       <Image
//         src="/banner.png"
//         alt="A collection of professionally designed icons"
//         width="500"
//         height="500"
//         className="order-first rounded-xl border-4 border-gray-200 sm:-order-none"
//       />
//     </section>
//   );
// }

// const HomePage: NextPage = () => {
//   return (
//     <>
//       <Head>
//         <title>Instant Icon Generator</title>
//         <meta
//           name="description"
//           content="Create unique icons instantly with our AI-powered generator."
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className="container mx-auto flex min-h-screen flex-col">
//         <HeroBanner />
//       </main>
//     </>
//   );
// };

// export default HomePage;
