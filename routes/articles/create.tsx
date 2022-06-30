/** @jsx h */
import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { createArticle } from "@db";
import { Handlers, PageProps } from "$fresh/server.ts";
import ContentForm from "@islands/ContentForm.tsx";

interface IData {
  error: {
    title: string;
    content: string;
  };

  title?: string;
  content?: string;
}

export const handler: Handlers<IData> = {
  async POST(req, ctx) {
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    // Validate the data
    if (!title || !content) {
      return ctx.render({
        error: {
          title: title ? "" : "Title is required",
          content: content ? "" : "Content is required",
        },
        title,
        content,
      });
    }

    const article = {
      title,
      content,
    };

    // Save the article to database
    await createArticle(article);

    // Redirect to the top page if the article is saved successfully
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  },
};

export default function CreateArticlePage(
  { data }: PageProps<IData | undefined>,
) {
  return (
    <div class={tw`min-h-screen bg-gray-200`}>
      <Head>
        <title>Create Post ::: Fresh Blog</title>
        <link rel="stylesheet" href="/article.css" />
      </Head>
      <div
        class={tw
          `max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col`}
      >
        <h1 class={tw`font-extrabold text-5xl text-gray-800`}>Create Post</h1>
        <form
          class={tw`rounded-xl border p-5 shadow-md bg-white mt-8`}
          method="POST"
        >
          <div class={tw`flex flex-col gap-y-2`}>
            <div class={tw`mb-4`}>
              <label class={tw`text-gray-500 text-sm`} htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={data?.title}
                class={tw
                  `w-full p-2 border border-gray-300 rounded-md focus:outline-none`}
              />
              {data?.error?.title && (
                <p class={tw`text-red-500 text-sm`}>{data.error.title}</p>
              )}
            </div>
          </div>
          <div class={tw`flex flex-col gap-y-2`}>
            <div class={tw`mb-4`}>
              <ContentForm initialValue={data?.content} />
              {data?.error?.content && (
                <p class={tw`text-red-500 text-sm`}>{data.error.content}</p>
              )}
            </div>
          </div>
          <div class={tw`flex justify-end`}>
            <button
              class={tw
                `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
