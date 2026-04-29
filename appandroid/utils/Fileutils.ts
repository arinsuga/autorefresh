import mime from 'mime';

export const useFileUri = (filePath: string): string => `file://${filePath}`;
export const useFilePath = (fileUri: string): string => fileUri.replace('file://', '');
export const useFileURL = (filePath: string): URL => {
    const fileUri = useFileUri(filePath);
    const url = new URL(fileUri);

    return url
}
export const useFileName = (filePath: string): string => {
    const fileName: string | undefined = useFileURL(filePath).pathname.split('/').pop();

    if (!fileName) {
        return '';
    }

    return fileName as string;
}
export const fileType = (filePath: string): string => {

    const result = mime.getType(filePath);

    if (!result) {
        return '';
    }

    return result as string;

}

const Fileutils = {

    uri: useFileUri,
    path: useFilePath,
    url: useFileURL,
    name: useFileName,
    type: fileType,

}

export default Fileutils;
