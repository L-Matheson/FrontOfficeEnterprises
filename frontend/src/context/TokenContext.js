import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * TokenContext
 * - Provides a global `tokenCount` and helpers to refresh/update it.
 * - `refreshTokenCount(aiId, chatHandler)` will call `chatHandler.getTokenCount(aiId)` if provided.
 *
 * Usage:
 * - Wrap your app with <TokenProvider> in src/index.js or App.js
 * - Call `const { tokenCount, refreshTokenCount, setTokenCount } = useToken()` in components
 */

const TokenContext = createContext({
  tokenCount: 0,
  setTokenCount: () => {},
  refreshTokenCount: async () => 0,
});

export const TokenProvider = ({ children }) => {
  const [tokenCount, setTokenCount] = useState(0);

  const refreshTokenCount = useCallback(async (aiId = 'assistant_dean', chatHandler = null) => {
    try {
      if (chatHandler && typeof chatHandler.getTokenCount === 'function') {
        const count = await chatHandler.getTokenCount(aiId);
        setTokenCount(count);
        return count;
      }
      return tokenCount;
    } catch (err) {
      console.error('TokenContext.refreshTokenCount error', err);
      return tokenCount;
    }
  }, [tokenCount]);

  return (
    <TokenContext.Provider value={{ tokenCount, setTokenCount, refreshTokenCount }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);

export default TokenContext;
