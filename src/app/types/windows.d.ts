// window.d.ts

export {};


declare global {
  interface OpenAIToolOutput {
    name?: string;
    [key: string]: any;
  }

  interface OpenAIWindowObject {
    toolOutput?: OpenAIToolOutput;
    [key: string]: any;
  }

  interface Window {
    openai?: OpenAIWindowObject;
  }
}
