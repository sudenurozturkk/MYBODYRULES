export async function generateResponse(prompt: string): Promise<string> {
  // Gerçek OpenAI API entegrasyonu için burayı güncelle
  // Şimdilik sahte bir cevap dönüyor
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('AI cevabı: ' + prompt);
    }, 1000);
  });
}
