import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem } from "@aws-amplify/datastore";

export enum RequestStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}



type EagerAccessRequests = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AccessRequests, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username?: string | null;
  readonly WebApplicationsRelation?: WebApplications | null;
  readonly requestdate?: string | null;
  readonly accessreason?: string | null;
  readonly status?: RequestStatus | keyof typeof RequestStatus | null;
  readonly approverusername?: string | null;
  readonly approverreason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accessRequestsWebApplicationsRelationId?: string | null;
}

type LazyAccessRequests = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AccessRequests, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username?: string | null;
  readonly WebApplicationsRelation: AsyncItem<WebApplications | undefined>;
  readonly requestdate?: string | null;
  readonly accessreason?: string | null;
  readonly status?: RequestStatus | keyof typeof RequestStatus | null;
  readonly approverusername?: string | null;
  readonly approverreason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accessRequestsWebApplicationsRelationId?: string | null;
}

export declare type AccessRequests = LazyLoading extends LazyLoadingDisabled ? EagerAccessRequests : LazyAccessRequests

export declare const AccessRequests: (new (init: ModelInit<AccessRequests>) => AccessRequests) & {
  copyOf(source: AccessRequests, mutator: (draft: MutableModel<AccessRequests>) => MutableModel<AccessRequests> | void): AccessRequests;
}

type EagerWebApplications = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WebApplications, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly approvergroup?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWebApplications = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WebApplications, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly approvergroup?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WebApplications = LazyLoading extends LazyLoadingDisabled ? EagerWebApplications : LazyWebApplications

export declare const WebApplications: (new (init: ModelInit<WebApplications>) => WebApplications) & {
  copyOf(source: WebApplications, mutator: (draft: MutableModel<WebApplications>) => MutableModel<WebApplications> | void): WebApplications;
}

type EagerFAQs = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FAQs, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly question?: string | null;
  readonly answer?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFAQs = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FAQs, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly question?: string | null;
  readonly answer?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FAQs = LazyLoading extends LazyLoadingDisabled ? EagerFAQs : LazyFAQs

export declare const FAQs: (new (init: ModelInit<FAQs>) => FAQs) & {
  copyOf(source: FAQs, mutator: (draft: MutableModel<FAQs>) => MutableModel<FAQs> | void): FAQs;
}

type EagerPage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Page, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly slug?: string | null;
  readonly body?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Page, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly slug?: string | null;
  readonly body?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Page = LazyLoading extends LazyLoadingDisabled ? EagerPage : LazyPage

export declare const Page: (new (init: ModelInit<Page>) => Page) & {
  copyOf(source: Page, mutator: (draft: MutableModel<Page>) => MutableModel<Page> | void): Page;
}