// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    usage: {
      queries: 0,
      images: 0,
      totalEnergy: 0,
      carbonFootprint: 0,
      waterFootprint: 0,
      serviceCounts: {
        chatgpt: 0,
        claude: 0,
        gemini: 0,
        copilot: 0,
        midjourney: 0,
        dalle: 0
      },
      lastReset: Date.now()
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'AI_QUERY_DETECTED') {
    chrome.storage.local.get(['usage'], (result) => {
      const usage = result.usage || {};
      const service = request.service;
      
      // Update counts
      usage.serviceCounts = usage.serviceCounts || {};
      usage.serviceCounts[service] = (usage.serviceCounts[service] || 0) + 1;
      
      if (request.isImage) {
        usage.images = (usage.images || 0) + 1;
      } else {
        usage.queries = (usage.queries || 0) + 1;
      }
      
      chrome.storage.local.set({ usage });
    });
  }
  return true;
});