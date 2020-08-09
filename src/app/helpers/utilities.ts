export function FormatFilename(menuName: string) {
  let filename = '';
  filename = menuName.replace(/[^a-zA-Z ]/g, ''); // remove all special characters
  filename = filename.replace(/ +(?= )/g, ''); // remove all extra spaces
  filename = filename.split(' ').join('_'); // replace all spaces with _
  return filename.toLowerCase();
}
