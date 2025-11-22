import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const dotProduct = (a: number[], b: number[]) => {
  return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
};

export const softmax = (arr: number[]) => {
  const exps = arr.map(Math.exp);
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
};
