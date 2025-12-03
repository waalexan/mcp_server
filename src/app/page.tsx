'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState<string | null>("Walter Santana");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.openai) {
      (window as any).openai = {};
    }

    let currentValue = (window as any).openai.toolOutput;

    Object.defineProperty((window as any).openai, "toolOutput", {
      get() {
        return currentValue;
      },
      set(newValue: any) {
        currentValue = newValue;
        if (newValue?.name) {
          setName(newValue.name);
        }
      },
      configurable: true,
      enumerable: true,
    });

    if (currentValue?.name) {
      setName(currentValue.name);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1 className="text-center text-4xl font-bold">
        Hello! {name || "Mr-body"}
      </h1>
    </div>
  );
}
