// The ArcKit LinkedIn page (admin: linkedin.com/company/146637218).
// Never /company/arckit: that is a different company.
export const LINKEDIN_ORG_ID = '146637218';

export function linkedInAddUrl({ certName, issuedAt, certUrl, certId }) {
  const d = new Date(issuedAt);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certName,
    organizationId: LINKEDIN_ORG_ID,
    issueYear: String(d.getUTCFullYear()),
    issueMonth: String(d.getUTCMonth() + 1),
    certUrl,
    certId,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}
