"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ClientType = "nudii" | "mefIA" | null;

const ClientContext = createContext<ClientType>(null);

export function ClientProvider({
  initialClient,
  children,
}: {
  initialClient: ClientType;
  children: React.ReactNode;
}) {
  const [client, setClient] = useState<ClientType>(initialClient);

  useEffect(() => {
    if (!initialClient) {
      const cookieClient = document.cookie.match(
        /client=(nudii|mefIA)/
      )?.[1] as ClientType;
      setClient(cookieClient || "mefIA");
    }
  }, []);

  return (
    <ClientContext.Provider value={client}>
      <div className="flex bg-[#fbfcfd] antialiased" data-client={client}>
        {children}
      </div>
    </ClientContext.Provider>
  );
}

export const useClient = () => useContext(ClientContext);
