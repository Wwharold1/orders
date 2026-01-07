export const convertBase64 = (
  file: File,
  callback: (width: number, height: number, reader: FileReader) => void
) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const image = new Image();
    image.src = reader.result as string;
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      callback(width, height, reader);
    };
  };

  reader.readAsDataURL(file);
};
