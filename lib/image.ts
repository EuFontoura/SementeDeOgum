const MAX_WIDTH = 800;
const QUALITY = 0.6;
const MAX_SIZE_BYTES = 900 * 1024;

export async function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", QUALITY);

        if (base64.length > MAX_SIZE_BYTES) {
          reject(
            new Error(
              `Imagem muito grande (${Math.round(base64.length / 1024)}KB). Máximo: ${Math.round(MAX_SIZE_BYTES / 1024)}KB.`
            )
          );
          return;
        }

        resolve(base64);
      };
      img.onerror = () => reject(new Error("Erro ao processar imagem"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export function getBase64SizeKB(base64: string): number {
  return Math.round(base64.length / 1024);
}
