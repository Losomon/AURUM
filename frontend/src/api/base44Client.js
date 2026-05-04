import { appParams } from '@/lib/app-params';
import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: appParams.appId,
  accessToken: appParams.token,
  appBaseUrl: appParams.appBaseUrl,
  functionsVersion: appParams.functionsVersion,
});
