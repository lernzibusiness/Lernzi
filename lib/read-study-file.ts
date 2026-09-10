const MAX_CHARACTERS = 500_000;

function validateText(text: string) {
  if (text.length > MAX_CHARACTERS) {
    throw new Error("This file contains more than 500,000 characters. Please split it into smaller files.");
  }
  if (!text.trim()) throw new Error("This file is empty. Choose notes with text.");
  return text;
}

export async function readStudyFile(file: File): Promise<string> {
  if (!/\.(pdf|txt|md)$/i.test(file.name)) {
    throw new Error("Choose a PDF, TXT or Markdown file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Choose a file smaller than 10 MB.");
  }
  const bytes = await file.arrayBuffer();
  if (!/\.pdf$/i.test(file.name)) {
    let text: string;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("We couldn’t read that text file. Save it as UTF-8 and try again.");
    }
    return validateText(text);
  }

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const assets = `/pdfjs/${pdfjs.version}/`;
  pdfjs.GlobalWorkerOptions.workerSrc = `${assets}pdf.worker.min.mjs`;
  const loading = pdfjs.getDocument({
    data: new Uint8Array(bytes),
    cMapUrl: `${assets}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${assets}standard_fonts/`,
    wasmUrl: `${assets}wasm/`,
    useSystemFonts: true,
  });
  try {
    const pdf = await loading.promise;
    let text = "";
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number);
      try {
        const content = await page.getTextContent();
        for (const item of content.items) {
          if (!("str" in item)) continue;
          text += item.str + (item.hasEOL ? "\n" : " ");
          if (text.length > MAX_CHARACTERS) validateText(text);
        }
        text += "\n";
      } finally {
        page.cleanup();
      }
    }
    if (!text.trim()) {
      throw new Error("No selectable text was found in this PDF. It may be scanned. Run text recognition (OCR) first, or paste your notes below.");
    }
    return validateText(text.trim());
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException") {
      throw new Error("This PDF is password-protected. Save an unlocked copy and try again.");
    }
    if (error instanceof Error && error.name === "InvalidPDFException") {
      throw new Error("This PDF is damaged or invalid. Try opening it in a PDF reader and saving a new copy.");
    }
    throw error;
  } finally {
    await loading.destroy();
  }
}
