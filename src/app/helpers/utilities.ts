export function FormatFilename(menuName: string) {
  let filename = '';
  filename = menuName.replace(/[^a-zA-Z0-9 ]/g, ''); // remove all special characters
  filename = filename.replace(/ +(?= )/g, '').trim(); // remove all extra spaces
  filename = filename.split(' ').join('_'); // replace all spaces with _
  return filename.toLowerCase();
}
