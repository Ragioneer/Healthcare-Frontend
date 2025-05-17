import "./globals.css";
import { ReactNode } from "react";
import { Rubik } from "next/font/google";
import { ClientProvider } from "../context/ClientContext";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  // const client = detectClient(headersList);
  const client = "nudii";
  return (
    <html
      lang="en"
      className={`text-foreground ${rubik.variable}`}
      data-client={client}
    >
      <body>
        <ClientProvider initialClient={client}>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </ClientProvider>
      </body>
    </html>
  );
}
