export function LightOrDark(color) {
  // Variables for red, green, blue values
  var r, g, b;

  // If hex --> Convert it to RGB: http://gist.github.com/983661
  color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

  r = color >> 16;
  g = (color >> 8) & 255;
  b = color & 255;

  // Counting the perceptive luminance - human eye favors green color...
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance > 0.5) return 'light';
  else return 'dark';
}
