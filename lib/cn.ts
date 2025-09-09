// import { clsx } from 'clsx'

// export function cn(...inputs) {
//   return clsx(inputs)
// }

import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const cn = (...inputs: any[]) => {
  return twMerge(clsx(inputs));
};

