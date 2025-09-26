export type RequestDemoPayload = {
  firstName: string;
  lastName: string;
  org: string;
  email: string;
  region: string;
  role: string;
  phone: string; // required
  source?: string;
};

export type ApiOk = { ok: true; [k: string]: any };
export type ApiErr = { ok: false; error?: string };
export type ApiResp = ApiOk | ApiErr;
