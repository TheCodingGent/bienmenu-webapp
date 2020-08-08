export function ValidateFile(
  file: File,
  size: number,
  allowedExtensions: string[]
) {
  return (
    file.size < size && allowedExtensions.includes(file.name.split('.').pop())
  );
}
