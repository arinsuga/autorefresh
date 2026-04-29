/**
 * Utility to clean plate number strings
 * Removes spaces from start, end, and middle
 * Converts to uppercase
 */
export const cleanPlateNumber = (plate: string): string => {
    if (!plate) return '';
    // Remove all whitespace characters using regex
    return plate.replace(/\s+/g, '').toUpperCase();
};
