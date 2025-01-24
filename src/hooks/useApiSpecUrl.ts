import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import isAuthenticatedAtom from '@/atoms/isAuthenticatedAtom';
import ApiService from '@/services/ApiService';

interface Props {
  apiName?: string;
  versionName?: string;
  definitionName?: string;
}

interface ReturnType {
  value?: string;
  isLoading: boolean;
}

export default function useApiSpecUrl({ apiName, versionName, definitionName }: Props): ReturnType {
  const [value, setValue] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

  const fetch = useCallback(async () => {
    if (!apiName || !versionName || !definitionName || !isAuthenticated) {
      setValue(undefined);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setValue(await ApiService.getSpecificationLink(apiName, versionName, definitionName));
    } finally {
      setIsLoading(false);
    }
  }, [apiName, definitionName, isAuthenticated, versionName]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    value,
    isLoading,
  };
}
