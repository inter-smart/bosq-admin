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


export function normalizeMapEmbed(input) {
  if (!input) return null;

  // Case 1: Full iframe string
  if (input.includes("<iframe")) {
    const match = input.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  }

  // Case 2: Already embed URL
  if (input.includes("/maps/embed")) {
    return input;
  }

  // Case 3: Normal Google Maps URL
  if (input.includes("google.com/maps")) {
    return input.replace(
      "https://www.google.com/maps?",
      "https://www.google.com/maps/embed?"
    );
  }

  return null;
}
