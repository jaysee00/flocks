export const convertRgbToHex = (r, g, b) => {
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 6)).join('0') + hex;
};

export const randomColour = () => {
    return convertRgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255) // Valid random colour must be an RGB
}

export const CANVAS_MAX_X = 1920;
export const CANVAS_MAX_Y = 1080;
export const CANVAS_MIN_X = 0;
export const CANVAS_MIN_Y = 0;