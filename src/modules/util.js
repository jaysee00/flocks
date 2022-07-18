export const convertRgbToHex = (r, g, b) => {
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 6)).join('0') + hex;
};