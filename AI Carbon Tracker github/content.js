// Detect AI service usage

const detectService = () => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('openai.com')) return 'chatgpt';
  if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) return 'chatgpt';
  if (hostname.includes('claude.ai')) return 'claude';
  if (hostname.includes('gemini.google.com')) return 'gemini';
  if (hostname.includes('copilot.microsoft.com')) return 'copilot';
  if (hostname.includes('midjourney.com')) return 'midjourney';
  
  return null;
};

// Monitor for AI interactions
const observeAIUsage = () => {
  const service = detectService();
  if (!service) return;

  // ChatGPT detection
  if (service === 'chatgpt') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.getAttribute('data-message-author-role') === 'assistant') {
            chrome.runtime.sendMessage({
              type: 'AI_QUERY_DETECTED',
              service: 'chatgpt',
              isImage: false
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Claude detection
  if (service === 'claude') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const isAssistantMessage = node.querySelector('[data-is-streaming="false"]') || 
                                      node.classList?.contains('font-claude-message');
            if (isAssistantMessage) {
              chrome.runtime.sendMessage({
                type: 'AI_QUERY_DETECTED',
                service: 'claude',
                isImage: false
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Similar logic for other services...
};

// Start observing when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAIUsage);
} else {
  observeAIUsage();
}