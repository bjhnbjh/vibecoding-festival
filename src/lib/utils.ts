type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean }

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter((x) => x != null && x !== false && x !== '')
    .join(' ')
    .trim()
}
