/**
 * Temporary in-memory store for application data keyed by Senang Pay order ID.
 *
 * After initiating payment we stash the full application here so that when
 * Senang Pay fires the server-to-server callback (which only carries order
 * fields), we can retrieve the complete applicant + plan + nominee data and
 * forward it to n8n.
 *
 * NOTE: This store lives in Node.js process memory. It survives across
 * requests within the same server process but will reset on restart and
 * does not work in multi-instance deployments. For production scale,
 * replace with a database (Postgres, Redis, etc.).
 */

export interface NomineeRecord {
  name: string;
  nric: string;
  relationship: string;
  nationality: string;
}

export interface ApplicationRecord {
  orderId: string;
  createdAt: string; // ISO timestamp

  // Plan
  planId: number;
  planName: string;
  ageBand: "under50" | "51to80";
  occCategory: "A" | "B";
  premiumRM: number; // base premium before tax/stamp (or 1.00 for voucher)
  totalRM: number; // total amount charged (including tax+stamp, or 1.00 for voucher)
  voucherApplied: boolean;

  // Applicant
  applicant: {
    name: string;
    email: string;
    nric: string;
    dob: string;
    gender: "male" | "female" | "";
    address: string;
    occupation: string;
    isSmoker: boolean;
  };

  // Nominees (0–2)
  nominees: NomineeRecord[];
}

// Module-level Map — persists for the lifetime of the Node.js process.
const store = new Map<string, ApplicationRecord>();

export function storeApplication(record: ApplicationRecord): void {
  store.set(record.orderId, record);
}

export function getApplication(orderId: string): ApplicationRecord | undefined {
  return store.get(orderId);
}

export function deleteApplication(orderId: string): void {
  store.delete(orderId);
}
