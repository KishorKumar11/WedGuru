import GlassCard from "../components/GlassCard";

type VendorStage = "Lead" | "Shortlisted" | "Booked" | "Rejected";

type VendorItem = {
  name: string;
  category: string;
  stage: VendorStage;
  quotedAmount: string;
  negotiatedAmount: string;
  paidAmount: string;
  dueAmount: string;
  nextPaymentDue: string;
  contractState: string;
  cancellationTerms: string;
  overtimeCost: string;
  contactOwner: string;
  contactHistory: string;
  riskFlag: string;
};

const vendorItems: VendorItem[] = [
  {
    name: "Luna Lens Studio",
    category: "Photography",
    stage: "Shortlisted",
    quotedAmount: "$2,000",
    negotiatedAmount: "$1,800",
    paidAmount: "$0",
    dueAmount: "$1,800",
    nextPaymentDue: "Deposit due in 5 days",
    contractState: "Draft received, review pending",
    cancellationTerms: "50% non-refundable",
    overtimeCost: "$250/hour",
    contactOwner: "Bride",
    contactHistory: "2 calls, 1 follow-up email",
    riskFlag: "Slow response in last 48h",
  },
  {
    name: "Rosewood Banquet Hall",
    category: "Venue",
    stage: "Booked",
    quotedAmount: "$7,500",
    negotiatedAmount: "$7,200",
    paidAmount: "$3,000",
    dueAmount: "$4,200",
    nextPaymentDue: "Final balance due in 30 days",
    contractState: "Signed on Apr 12",
    cancellationTerms: "Full refund before 90 days",
    overtimeCost: "$300/hour",
    contactOwner: "Planner",
    contactHistory: "Site visit complete, timeline shared",
    riskFlag: "No current risks",
  },
];

const coordinationAreas = [
  {
    title: "Vendor sourcing",
    description: "Research, interview, and pitch top-tier event professionals.",
  },
  {
    title: "Contract review",
    description: "Analyze vendor contracts to ensure clear and fair terms.",
  },
  {
    title: "Payment tracking",
    description: "Track deposits and balances, with due-date reminders.",
  },
  {
    title: "Logistics alignment",
    description: "Share final counts, timelines, and setup notes with vendors.",
  },
];

const missingCapabilities = [
  "Vendor stages: Lead, Shortlisted, Booked, Rejected",
  "Category tags: venue, photo, video, makeup, decor, music, catering",
  "Budget fields: quoted, negotiated, paid, due",
  "Payment reminders: deposit and final balance deadlines",
  "Contract metadata: signed date, cancellation terms, overtime rates",
  "Contact log: calls, emails, notes, follow-up history",
  "Attachments: contracts, invoices, portfolios, moodboards",
  "Risk flags: no response, over budget, legal concerns",
  "Owner assignment for team workflows",
];

const futureVision = [
  "Partnered vendor marketplace inside WedGuru",
  "In-app package comparison and negotiation tracking",
  "In-app contract finalization and e-sign flow",
  "Built-in payment settlement and milestone releases",
  "Automated reminders and status sync with vendor portals",
];

function getStageColor(stage: VendorStage) {
  switch (stage) {
    case "Lead":
      return "rgba(212, 172, 13, 0.18)";
    case "Shortlisted":
      return "rgba(52, 152, 219, 0.2)";
    case "Booked":
      return "rgba(46, 204, 113, 0.2)";
    case "Rejected":
      return "rgba(231, 76, 60, 0.2)";
    default: {
      const exhaustiveCheck: never = stage;
      return exhaustiveCheck;
    }
  }
}

export default function Vendors() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Vendor Coordination">
        <p style={{ marginTop: 0 }}>
          Keep track of all vendors in one place. This page is intentionally light for now while we build deeper
          workflow features.
        </p>
        <div className="glass" style={{ padding: "0.8rem", border: "1px dashed rgba(110, 48, 79, 0.4)" }}>
          <strong>Building now:</strong> foundational vendor tracking page with roadmap for full in-app vendor
          partnerships and settlement.
        </div>
      </GlassCard>

      <GlassCard title="Core coordination">
        <div style={{ display: "grid", gap: 10 }}>
          {coordinationAreas.map((area) => (
            <section key={area.title} className="glass" style={{ padding: "0.75rem" }}>
              <h3 style={{ margin: "0 0 0.4rem" }}>{area.title}</h3>
              <p style={{ margin: 0 }}>{area.description}</p>
            </section>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Current vendor tracker (starter)">
        <div style={{ display: "grid", gap: 12 }}>
          {vendorItems.map((vendor) => (
            <article key={vendor.name} className="glass" style={{ padding: "0.9rem", display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0 }}>{vendor.name}</h3>
                <span
                  style={{
                    background: getStageColor(vendor.stage),
                    borderRadius: 999,
                    padding: "0.2rem 0.65rem",
                    fontSize: 13,
                  }}
                >
                  {vendor.stage}
                </span>
              </div>
              <p style={{ margin: 0 }}>
                <strong>Category:</strong> {vendor.category}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Costs:</strong> Quoted {vendor.quotedAmount}, Negotiated {vendor.negotiatedAmount}, Paid{" "}
                {vendor.paidAmount}, Due {vendor.dueAmount}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Payment:</strong> {vendor.nextPaymentDue}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Contract:</strong> {vendor.contractState} | {vendor.cancellationTerms} | Overtime{" "}
                {vendor.overtimeCost}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Ownership and contact:</strong> {vendor.contactOwner} owner, {vendor.contactHistory}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Risk flag:</strong> {vendor.riskFlag}
              </p>
            </article>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Coverage added from your checklist">
        <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "grid", gap: 4 }}>
          {missingCapabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard title="Future seamless partner experience">
        <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "grid", gap: 4 }}>
          {futureVision.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
