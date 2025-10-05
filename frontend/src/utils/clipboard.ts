/**
 * Copies text to clipboard and clears it after the specified timeout
 */
export const copyToClipboardWithTimeout = async (
  text: string,
  timeoutMs: number = 15000
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    
    // Clear clipboard after timeout
    setTimeout(async () => {
      try {
        // Read current clipboard content
        const currentClipboard = await navigator.clipboard.readText();
        
        // Only clear if the clipboard still contains our text
        if (currentClipboard === text) {
          await navigator.clipboard.writeText('');
        }
      } catch (error) {
        // Clipboard read permission might be denied, that's okay
        console.log('Could not verify clipboard content for auto-clear');
      }
    }, timeoutMs);
  } catch (error) {
    throw new Error('Failed to copy to clipboard');
  }
};
