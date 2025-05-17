import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CustomMarkdownProps = {
  children: string;
};
const CustomMarkdown: FC<CustomMarkdownProps> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const id = String(children)
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");
          return (
            <h1 id={id} className="text-xl md:text-3xl font-semibold mt-8 mb-4">
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          const id = String(children)
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");
          return (
            <h2 id={id} className="text-lg md:text-2xl font-semibold mt-8 mb-4">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const id = String(children)
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");
          return (
            <h3 id={id} className="text-md md:text-xl font-semibold mt-8 mb-4">
              {children}
            </h3>
          );
        },
        h4: ({ children }) => {
          const id = String(children)
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");
          return (
            <h4 id={id} className="text-sm md:text-lg font-semibold mt-8 mb-4">
              {children}
            </h4>
          );
        },
        h5: ({ children }) => {
          const id = String(children)
            .toLowerCase()

            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");
          return (
            <h5
              id={id}
              className="text-xs md:text-base font-semibold mt-8 mb-4"
            >
              {children}
            </h5>
          );
        },
        h6: ({ children }) => {
          const id = String(children)
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .replace(/\s+/g, "-");

          return (
            <h6
              id={id}
              className="text-[10px] md:text-sm font-semibold mt-8 mb-4"
            >
              {children}
            </h6>
          );
        },

        p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-8 pl-6 list-disc space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-8 pl-6 list-decimal space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li className="pl-2">{children}</li>,

        table: ({ children }) => (
          <table className="w-full divide-y divide-gray-200">{children}</table>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-gray-200">{children}</tbody>
        ),
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-2 py-3 text-left text-xs font-medium whitespace-normal text-gray-500 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-2 py-4 whitespace-normal text-sm text-gray-900">
            {children}
          </td>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;
