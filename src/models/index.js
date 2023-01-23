// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RequestStatus = {
  "APPROVED": "APPROVED",
  "REJECTED": "REJECTED"
};

const { AccessRequests, WebApplications, FAQs, Page } = initSchema(schema);

export {
  AccessRequests,
  WebApplications,
  FAQs,
  Page,
  RequestStatus
};