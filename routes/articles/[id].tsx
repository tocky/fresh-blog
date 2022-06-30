/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { findArticleById, IArticle } from "@db";
import dayjs from "dayjs";
import { marked } from "marked";
import sanitize from "sanitize-html";

interface IData {
  // Article which is fetched from database
  article: IArticle;
  // Parsed markdown content
  parsedContent: string;
}

export const handler: Handlers<IData | null> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const article = await findArticleById(id);
    if (!article) {
      return ctx.render(null);
    }

    // Parse markdown content
    const parsed = marked(article.content);
    // Sanitize html
    const parsedContent = sanitize(parsed);

    return ctx.render({ article, parsedContent });
  },
};

export default function ArticlePage({ data }: PageProps<IData | null>) {
  // Render "Not Found" if the data is null
  if (!data) {
    return <div>Not Found</div>;
  }

  const { article, parsedContent } = data;

  return (
    <div class={tw`min-h-screen bg-gray-200`}>
      <Head>
        <title>{article.title} ::: Fresh Blog</title>
        <link rel="stylesheet" href="/article.css" />
      </Head>
      <div
        class={tw
          `max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col`}
      >
        <article class={tw`rounded-xl border p-5 shadow-md bg-white`}>
          <header>
            <h1 class={tw`font-extrabold text-5xl text-gray-800`}>
              {article.title}
            </h1>
            <time
              class={tw`text-gray-500 text-sm`}
              dateTime={article.created_at}
            >
              {dayjs(article.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </time>
          </header>
          <section class={tw`mt-6`}>
            <div
              id="contents"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            >
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
