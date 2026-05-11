/**
 * PlateUtils.ts
 * Utility for handling Indonesian license plate strings.
 * Enforces strict alphanumeric format without spaces or special characters.
 */

export const cleanPlateNumber = (text: string): string => {
    if (!text) return '';
    // REMOVE EVERYTHING except letters and numbers (strips spaces, symbols, etc.)
    return text.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

export const formatPlateNumber = (text: string): string => {
    // In this version, formatting means stripping all spaces and returning a continuous string
    return cleanPlateNumber(text);
};
