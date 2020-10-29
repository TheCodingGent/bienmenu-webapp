import { file } from '@rxweb/reactive-form-validators';

export function FormatFilename(itemName: string, currentVersion?: number) {
  let filename = '';
  filename = itemName.replace(/[^a-zA-Z0-9 ]/g, ''); // remove all special characters
  filename = filename.replace(/ +(?= )/g, '').trim(); // remove all extra spaces
  filename = filename.split(' ').join('_'); // replace all spaces with _

  if (currentVersion) {
    currentVersion = currentVersion + 1;
    filename = filename + '_v' + currentVersion;
  } else {
    filename = filename + '_v0';
  }

  return filename.toLowerCase();
}

export function GetFileVersion(itemFilename: string) {
  if (!itemFilename) {
    return 0;
  }

  let i = itemFilename.lastIndexOf('v');
  let version = itemFilename.substring(i + 1);
  return parseInt(version);
}
