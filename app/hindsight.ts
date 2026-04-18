// This mimics the Hindsight API behavior using your browser's Storage
// It ensures your project works 100% while you wait for API access

export const storeMemory = async (dealId: string, content: string) => {
  try {
    // Simulate a network delay (makes it feel like real AI)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get existing memories from local storage
    const existingRaw = localStorage.getItem(`deal_memory_${dealId}`);
    const memories = existingRaw ? JSON.parse(existingRaw) : [];

    // Add the new memory with a timestamp
    const newMemory = {
      id: Date.now(),
      text: content,
      date: new Date().toLocaleString()
    };

    memories.push(newMemory);
    
    // Save back to storage
    localStorage.setItem(`deal_memory_${dealId}`, JSON.stringify(memories));
    
    return { success: true, data: newMemory };
  } catch (error) {
    console.error("Storage Error:", error);
    return null;
  }
};

export const getMemoriesForDeal = async (dealId: string) => {
  try {
    const existingRaw = localStorage.getItem(`deal_memory_${dealId}`);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch (error) {
    return [];
  }
};