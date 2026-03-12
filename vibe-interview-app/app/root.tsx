import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { resolveLanguage } from "~/lib/cookies";
import { LanguageProvider } from "~/contexts/LanguageContext";
import type { TranslationMap } from "~/contexts/LanguageContext";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const lang = resolveLanguage(request);

  let translations: TranslationMap = {};
  try {
    const url = new URL(`/content/${lang}/ui.json`, request.url);
    const res = await fetch(url.toString());
    if (res.ok) {
      const dict = (await res.json()) as Record<string, string>;
      translations = { ui: dict };
    }
  } catch {
    // Non-fatal: components will fall back to translation keys.
  }

  return { lang, translations };
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Unbounded:wght@400;700;900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang } = useLoaderData<typeof loader>();
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme-preference");var r;if(t==="dark"||t==="light"){r=t}else{r=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",r)}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { lang, translations } = useLoaderData<typeof loader>();

  return (
    <LanguageProvider lang={lang} translations={translations}>
      <Outlet />
    </LanguageProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
