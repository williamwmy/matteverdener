import { useProfileContext } from '../context/ProfileContext.jsx';

/**
 * Leser og skriver den aktive profilen.
 * @returns {{
 *   state: object,
 *   saveFailed: boolean,
 *   activeProfile: object|null,
 *   addProfile: function(string, string): void,
 *   removeProfile: function(string): void,
 *   selectProfile: function(string): void,
 *   updateActiveProfile: function(object): void,
 * }}
 */
export function useProfile() {
  return useProfileContext();
}
