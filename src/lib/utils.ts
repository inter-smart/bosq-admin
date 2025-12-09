import { clsx, type ClassValue } from "clsx"
import { Parser } from "htmlparser2";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const renderHTML = (html: string): string => {
  let result = "";

  const parser = new Parser(
    {
      ontext(text) {
        result += text + " "; // keep spacing natural
      },
    },
    { decodeEntities: true }
  );

  parser.write(html);
  parser.end();

  return result.trim();
};
