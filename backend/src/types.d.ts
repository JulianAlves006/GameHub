export type PresignUploadBody = {
  contentType: string;
  extension?: string;
};

export type PresignReadQuery = {
  key?: string;
  ttl?: string;
};

export type DeleteBody = {
  key?: string;
};
