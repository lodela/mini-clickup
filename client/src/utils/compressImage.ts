/**
 * Comprime una imagen a máximo maxBytes usando canvas.
 * Reduce calidad iterativamente hasta cumplir el límite.
 * Si la imagen ya cumple, la retorna sin cambios.
 */
export async function compressImage(file: File, maxBytes = 1.8 * 1024 * 1024): Promise<File> {
  if (file.size <= maxBytes) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');

      // Escalar dimensiones si son muy grandes
      let { width, height } = img;
      const MAX_DIM = 1200;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;

      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);

          if (blob.size <= maxBytes || quality <= 0.1) {
            const ext = file.name.replace(/\.[^.]+$/, '');
            resolve(new File([blob], `${ext}.jpg`, { type: 'image/jpeg' }));
          } else {
            quality = Math.round((quality - 0.1) * 10) / 10;
            tryCompress();
          }
        }, 'image/jpeg', quality);
      };

      tryCompress();
    };

    img.src = url;
  });
}
