import { urlLookupTable } from './table';

export const getUrlFromLookupTable = (
  url: string,
  env: 'dev' | 'q0' | 'q1' | 'q2' | 'q6'
) => {
  let match;
  const lookupTable = urlLookupTable[env];
  if (url && lookupTable) {
    Object.keys(lookupTable).some((key) => {
      if (url.startsWith(key)) {
        match = key;
        return true;
      }
      return false;
    });
  }
  return match ? url.replace(match, lookupTable[match]) : url;
};
