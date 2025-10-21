---
description: Research technology, services, and products to meet requirements with build vs buy analysis
tags: [research, build-vs-buy, vendor, procurement, digital-marketplace, tco, saas, open-source]
---

# Technology and Service Research

You are helping an enterprise architect research available technologies, services, and products that can meet the project's requirements and inform build vs buy decisions.

## User Input

```text
$ARGUMENTS
```

## Context

This command performs **market research** to identify available solutions that can satisfy the project's requirements. It supports:

- **Build vs Buy decisions**: Should we build custom, buy commercial, or use open source?
- **Vendor shortlisting**: Which vendors/products are best fit?
- **Cost analysis**: TCO comparison across options
- **UK Government procurement**: Integration with Digital Marketplace and GOV.UK platforms
- **Wardley mapping input**: Research findings feed into value chain positioning
- **SOBC Economic Case**: Cost and benefit data for business case

## Instructions

### 1. Check Prerequisites

**MANDATORY**:
- Check if `requirements.md` exists for this project
  - Look for `projects/*/requirements.md` files
  - If requirements don't exist, **STOP** and tell user to run `/arckit.requirements` first
  - Research MUST be based on requirements analysis

**RECOMMENDED**:
- Check if `data-model.md` exists
  - Understand data entities and integration needs
- Check if `stakeholder-drivers.md` exists
  - Understand stakeholder priorities for research focus
- Check if project is UK Government
  - Look for "UK Government", "Ministry of", "Department for", "NHS", "MOD" in project name or requirements
  - If UK Gov, prioritize Digital Marketplace and GOV.UK platforms

### 2. Find the Project

- If user specifies project name or number, use that
- Otherwise, look for most recent project directory in `projects/`
- Use the same project directory where requirements.md exists

### 3. Read the Template

Read `.arckit/templates/research-findings-template.md` to understand the output structure

### 4. Extract and Analyze Requirements

**Read `requirements.md` and extract**:

**A. Functional Requirements (FR-xxx)**:
- User workflows and features
- Business capabilities needed
- Integration patterns required

**B. Non-Functional Requirements (NFR-xxx)**:
- Performance (NFR-P-xxx)
- Security (NFR-SEC-xxx)
- Scalability (NFR-S-xxx)
- Availability (NFR-A-xxx)
- Compliance (NFR-C-xxx)

**C. Integration Requirements (INT-xxx)**:
- External system integrations
- API needs
- Event-driven patterns

**D. Data Requirements (DR-xxx)**:
- Database needs
- Data storage volume
- Data privacy/GDPR

### 5. Dynamically Identify Research Categories

**CRITICAL**: Do NOT use a fixed list of categories. **Analyze requirements to identify what capabilities are needed**.

**Category Detection Logic**:

Scan requirements for keywords and patterns to identify research categories:

#### Authentication & Identity Management
**Triggers**:
- FR-xxx mentions: "login", "sign in", "authenticate", "user account", "SSO", "single sign-on", "MFA", "multi-factor"
- NFR-SEC-xxx mentions: "authentication", "OAuth", "SAML", "identity provider", "user management"

**Research**:
- SaaS: Auth0, Okta, Azure AD B2C, AWS Cognito
- Open Source: Keycloak, Ory, Authentik
- UK Gov: GOV.UK One Login (if public sector)

#### Payment Processing
**Triggers**:
- FR-xxx mentions: "payment", "checkout", "transaction", "purchase", "invoice", "billing", "refund", "card", "bank transfer"
- NFR-C-xxx mentions: "PCI-DSS", "payment card industry"

**Research**:
- SaaS: Stripe, Adyen, PayPal, Worldpay
- Managed Services: Barclaycard, Sage Pay
- UK Gov: GOV.UK Pay (if public sector)

#### Database & Data Storage
**Triggers**:
- DR-xxx exists OR NFR-P-xxx mentions: "database", "data store", "persistence", "data volume"
- Data model includes multiple entities with relationships

**Research**:
- Relational: PostgreSQL (AWS RDS, Azure Database), MySQL, SQL Server
- Document: MongoDB Atlas, AWS DynamoDB, Azure Cosmos DB
- Graph: Neo4j Aura, Amazon Neptune
- Time-series: InfluxDB Cloud, TimescaleDB Cloud
- Open Source: PostgreSQL, MySQL, MongoDB, Redis

#### Email & Notifications
**Triggers**:
- FR-xxx mentions: "email", "notification", "alert", "SMS", "push notification", "message"
- INT-xxx mentions: "send email", "notify user"

**Research**:
- Email SaaS: SendGrid, AWS SES, Mailgun, Postmark
- SMS: Twilio, AWS SNS, Vonage
- Push: Firebase Cloud Messaging, OneSignal
- UK Gov: GOV.UK Notify (if public sector)

#### Document Management & Storage
**Triggers**:
- FR-xxx mentions: "document", "file upload", "file storage", "attachment", "media", "image", "PDF"
- DR-xxx mentions: "document retention", "file storage"

**Research**:
- Object Storage: AWS S3, Azure Blob Storage, Google Cloud Storage
- Document Management: SharePoint, Box, Dropbox Business
- Open Source: MinIO, NextCloud

#### Search
**Triggers**:
- FR-xxx mentions: "search", "find", "filter", "query", "full-text search", "autocomplete"

**Research**:
- SaaS: Algolia, Elasticsearch Service (Elastic Cloud), AWS OpenSearch
- Open Source: Elasticsearch, OpenSearch, Meilisearch, Typesense

#### Analytics & Reporting
**Triggers**:
- FR-xxx mentions: "report", "dashboard", "analytics", "metrics", "KPI", "business intelligence", "data visualization"
- BR-xxx mentions: "insights", "reporting", "data-driven"

**Research**:
- BI Platforms: Power BI, Tableau, Looker, Metabase
- Analytics: Google Analytics, Mixpanel, Amplitude
- Open Source: Metabase, Apache Superset, Grafana

#### Workflow & Business Process
**Triggers**:
- FR-xxx mentions: "workflow", "approval", "process", "state machine", "orchestration", "task management"

**Research**:
- Workflow Engines: Camunda, Temporal, AWS Step Functions
- BPM: ServiceNow, Pega, Appian
- Open Source: Camunda, Apache Airflow, Temporal

#### Messaging & Event Streaming
**Triggers**:
- INT-xxx mentions: "queue", "message queue", "event", "pub/sub", "event-driven", "asynchronous", "streaming"
- NFR-S-xxx mentions: "decoupling", "async processing"

**Research**:
- Managed Services: AWS SQS/SNS, Azure Service Bus, Google Pub/Sub, Confluent Cloud (Kafka)
- Message Brokers: RabbitMQ (CloudAMQP), Amazon MQ
- Open Source: RabbitMQ, Apache Kafka, Redis Streams

#### API Management
**Triggers**:
- INT-xxx mentions: "API", "REST API", "GraphQL", "API gateway", "rate limiting", "API versioning"
- NFR-SEC-xxx mentions: "API authentication", "API security"

**Research**:
- API Gateways: Kong, AWS API Gateway, Azure API Management, Apigee
- Open Source: Kong, Tyk, KrakenD

#### Hosting & Infrastructure
**Triggers**:
- NFR-P-xxx or NFR-S-xxx mentions: "scalability", "availability", "uptime", "hosting", "infrastructure", "deployment"
- NFR-A-xxx exists (availability requirements)

**Research**:
- Cloud Providers: AWS, Azure, Google Cloud Platform
- PaaS: Heroku, Railway, Render, Fly.io
- Serverless: AWS Lambda, Azure Functions, Google Cloud Functions
- UK Gov: Government Cloud (if public sector at OFFICIAL-SENSITIVE or above)

#### Monitoring & Observability
**Triggers**:
- NFR-M-xxx mentions: "monitoring", "logging", "observability", "metrics", "tracing", "alerting", "APM"

**Research**:
- APM: Datadog, New Relic, Dynatrace, AppDynamics
- Logging: Splunk, Sumo Logic, Loggly
- Open Source: Prometheus + Grafana, ELK Stack, Jaeger
- Cloud-Native: AWS CloudWatch, Azure Monitor, GCP Operations Suite

#### CI/CD & DevOps
**Triggers**:
- NFR-M-xxx mentions: "deployment", "CI/CD", "continuous integration", "continuous deployment", "pipeline"
- Requirements mention: "automated testing", "deployment automation"

**Research**:
- CI/CD: GitHub Actions, GitLab CI, CircleCI, Jenkins
- Container Orchestration: Kubernetes (EKS, AKS, GKE), AWS ECS, Docker Swarm
- Open Source: Jenkins, GitLab, Tekton

#### CRM & Customer Data
**Triggers**:
- FR-xxx mentions: "customer", "CRM", "contact management", "lead", "opportunity", "sales"
- DR-xxx mentions: "customer entity", "customer data"

**Research**:
- CRM: Salesforce, HubSpot, Microsoft Dynamics 365, Zoho CRM
- Open Source: SuiteCRM, EspoCRM

#### Content Management (CMS)
**Triggers**:
- FR-xxx mentions: "content management", "CMS", "blog", "articles", "pages", "editorial workflow"

**Research**:
- Headless CMS: Contentful, Strapi, Sanity
- Traditional CMS: WordPress, Drupal
- UK Gov: GOV.UK Publishing (if public sector)

#### E-commerce
**Triggers**:
- FR-xxx mentions: "e-commerce", "shopping cart", "product catalog", "checkout", "order management", "inventory"

**Research**:
- Platforms: Shopify, WooCommerce, Magento, BigCommerce
- Headless Commerce: commercetools, Saleor
- Open Source: WooCommerce, Magento Open Source, PrestaShop

#### Video/Media Streaming
**Triggers**:
- FR-xxx mentions: "video", "streaming", "media", "live stream", "VOD", "video on demand"

**Research**:
- Video Platforms: Vimeo, Wistia, Mux
- CDN + Streaming: Cloudflare Stream, AWS CloudFront + MediaConvert
- Open Source: Jellyfin, PeerTube

#### Collaboration & Communication
**Triggers**:
- FR-xxx mentions: "chat", "messaging", "video call", "collaboration", "real-time communication", "websocket"

**Research**:
- Team Collaboration: Slack, Microsoft Teams, Discord
- Video: Zoom, Microsoft Teams, Google Meet
- Open Source: Mattermost, Rocket.Chat, Jitsi

#### Machine Learning / AI
**Triggers**:
- FR-xxx mentions: "machine learning", "AI", "artificial intelligence", "prediction", "recommendation", "NLP", "computer vision"

**Research**:
- ML Platforms: AWS SageMaker, Azure ML, Google Vertex AI
- AI APIs: OpenAI, Anthropic Claude, Google Cloud AI
- Open Source: TensorFlow, PyTorch, Hugging Face

#### Testing & Quality Assurance
**Triggers**:
- NFR-M-xxx mentions: "testing", "quality assurance", "automated testing", "load testing", "security testing"

**Research**:
- Test Automation: Selenium, Playwright, Cypress
- Load Testing: k6, JMeter, Gatling, BlazeMeter
- Security Testing: OWASP ZAP, Burp Suite, Snyk

**IMPORTANT**: Only research categories where requirements exist. If a project doesn't mention payments, don't research payment processing.

### 6. Research Options for Each Category

For each identified category, research:

#### A. Commercial SaaS Options

For each SaaS option, document:
- **Vendor/Product Name**
- **Description**: What it does, key features
- **Pricing Model**: Per user/month, per transaction, tiered pricing, free tier?
- **Cost Estimate**: Based on projected usage from requirements
- **Pros**: Why this is a good fit
- **Cons**: Limitations or concerns
- **UK Availability**: Available in UK? Data residency?
- **Compliance**: GDPR, ISO 27001, SOC 2, etc.
- **Integration**: APIs, webhooks, SDKs available?
- **Maturity**: Established vendor or startup?
- **References**: Similar customers, case studies

#### B. Open Source Options

For each open source option, document:
- **Project Name**
- **Description**: What it does, key features
- **License**: MIT, Apache 2.0, GPL, AGPL (license restrictions?)
- **Maturity**: GitHub stars, commit activity, last release date
- **Support**: Commercial support available? (e.g., Redis Labs for Redis)
- **Hosting Options**: Self-hosted, managed service available?
- **Total Cost of Ownership**:
  - Infrastructure costs (servers, storage, bandwidth)
  - Engineering time (setup, maintenance, upgrades)
  - Support costs (if purchasing commercial support)
- **Pros**: Why this is a good fit
- **Cons**: Limitations or concerns

#### C. Managed Services (Cloud Provider)

For each managed service (AWS, Azure, GCP), document:
- **Service Name**
- **Description**: What it does
- **Pricing Model**: On-demand, reserved, usage-based
- **Cost Estimate**: Based on projected usage
- **Pros**: Integration with existing cloud environment, managed operations
- **Cons**: Vendor lock-in, potential cost at scale
- **Availability**: Region availability (UK regions?)

#### D. UK Government Options (if applicable)

If project is UK Government (central government, devolved administrations, NHS, local authorities, blue light services), **PRIORITIZE GOV.UK platforms and Digital Marketplace suppliers**:

**GOV.UK Platforms** (Free or subsidized for public sector):
- **GOV.UK One Login**: Authentication and identity verification for public services
- **GOV.UK Pay**: Payment processing for public sector (no setup fees, 1.5% transaction fee)
- **GOV.UK Notify**: Email, SMS, letters (free for central government, charged for others)
- **GOV.UK PaaS (Cloud Foundry)**: Hosting platform (being deprecated, check status)
- **GOV.UK Forms**: Form builder for government services
- **GOV.UK Publishing**: Content management for government websites

**Digital Marketplace**:
- **G-Cloud 14**: Cloud hosting, software, and support
- **Digital Outcomes and Specialists (DOS)**: Outcomes, specialists, user research
- **Criteria**: Check Digital Marketplace for suppliers in relevant categories
- **Benefits**: Pre-approved suppliers, framework terms, SME-friendly

**Technology Code of Practice (TCoP)** Alignment:
- Prefer open standards and open source
- Use cloud first (public cloud preferred)
- Make things secure (security by design)
- Use common platforms (GOV.UK platforms)

### 7. Build vs Buy Analysis

For each research category, provide **Build vs Buy recommendation**:

#### Build (Custom Development)

**When to Build**:
- Unique competitive advantage or IP
- Existing solutions don't meet requirements
- Security/compliance requires complete control
- Long-term TCO favors build over subscription fees

**Effort Estimate**:
- Engineering time: [X] person-months
- Skills required: [Technologies/expertise needed]
- Ongoing maintenance: [Y] FTE ongoing

**Cost Estimate**:
- Development: £[X] (based on [rate] × [days])
- Infrastructure: £[Y]/year
- Maintenance: £[Z]/year (20-30% of dev cost)
- **Total Year 1**: £[TOTAL]
- **Total 3-Year TCO**: £[TOTAL]

#### Buy (Commercial SaaS)

**When to Buy**:
- Commodity capability (not differentiating)
- Vendor provides comprehensive solution
- Speed to market critical
- Managed service reduces operational burden

**Cost Estimate** (for each vendor option):
- Setup/onboarding: £[X] (one-time)
- Subscription: £[Y]/month or £[Z]/year
- Integration effort: [X] person-weeks at £[rate]
- **Total Year 1**: £[TOTAL]
- **Total 3-Year TCO**: £[TOTAL]

#### Adopt (Open Source)

**When to Adopt Open Source**:
- Mature, well-supported project
- Engineering team has expertise to support it
- Licensing compatible with project
- Community or commercial support available

**Cost Estimate**:
- Infrastructure: £[X]/year (hosting costs)
- Setup: [Y] person-weeks at £[rate]
- Commercial support (optional): £[Z]/year
- Maintenance: [W] person-weeks/year at £[rate]
- **Total Year 1**: £[TOTAL]
- **Total 3-Year TCO**: £[TOTAL]

#### Recommendation

**Recommended Approach**: [BUILD | BUY | ADOPT | HYBRID]

**Rationale**: [Why this is the best approach given requirements, budget, timeline, team capabilities]

**Shortlist**: [Top 2-3 specific products/vendors for further evaluation]

### 8. UK Government Specific Considerations

If this is a UK Government project, **MANDATORY**:

#### Technology Code of Practice (TCoP) Compliance

Assess against 13 TCoP points relevant to technology selection:

**1. Define user needs**: Research should be driven by user needs in requirements
**2. Make things accessible**: All solutions must meet WCAG 2.1 AA
**3. Be open and use open standards**: Prefer open source and open standards
**4. Make use of open source**: Consider open source options first
**5. Use cloud first**: Public cloud (AWS, Azure, GCP) preferred over on-premise
**6. Make things secure**: Security by design, vetted suppliers
**7. Make privacy integral**: GDPR compliance mandatory, UK data residency
**8. Share, reuse and collaborate**: Use common platforms (GOV.UK platforms)
**9. Integrate and adapt technology**: APIs, interoperability
**10. Make better use of data**: Open data formats, data standards
**11. Define your purchasing strategy**: Digital Marketplace preferred
**12. Meet the Service Standard**: If building a public-facing service
**13. Spend controls**: Spend approval process (if >£100k)

#### Digital Marketplace Strategy

**Research Digital Marketplace suppliers**:
- Browse G-Cloud 14 for [relevant category]
- Browse DOS for [relevant outcomes/specialists]
- Check supplier ratings and past performance
- Note: Digital Marketplace enforces framework terms (no custom contracts)

**Benefits**:
- Pre-approved suppliers (due diligence done)
- SME-friendly (1/3 spend with SMEs)
- Crown Commercial Service framework (no procurement delays)
- Fixed day rates for specialists

#### Government Cloud Considerations

**For OFFICIAL data**:
- Public cloud (AWS, Azure, GCP) acceptable
- Use UK regions where available

**For OFFICIAL-SENSITIVE data**:
- Public cloud acceptable with additional controls
- Consider Government Cloud (IL2) if required by department

**For SECRET data**:
- Government Cloud (IL3+) or air-gapped infrastructure
- Specialist MOD or security-cleared suppliers

### 9. Total Cost of Ownership (TCO) Comparison

Create a **3-year TCO comparison table** across all options for each category:

| Option | Year 1 | Year 2 | Year 3 | 3-Year TCO | Notes |
|--------|--------|--------|--------|------------|-------|
| **Build Custom** | £[X] | £[Y] | £[Z] | £[TOTAL] | Includes dev, infra, maintenance |
| **Buy: [Vendor A]** | £[X] | £[Y] | £[Z] | £[TOTAL] | Subscription + integration |
| **Buy: [Vendor B]** | £[X] | £[Y] | £[Z] | £[TOTAL] | Subscription + integration |
| **Adopt: [Open Source]** | £[X] | £[Y] | £[Z] | £[TOTAL] | Infra + setup + maintenance |
| **GOV.UK [Platform]** | £[X] | £[Y] | £[Z] | £[TOTAL] | If UK Gov project |

**TCO Factors to Include**:
- Initial setup/development costs
- Subscription/license fees
- Infrastructure costs (compute, storage, bandwidth)
- Integration effort (one-time)
- Training costs
- Ongoing maintenance (% of dev cost or engineering time)
- Support costs (commercial support if open source)
- Migration costs (if replacing existing system)
- Exit costs (data export, migration if switching vendors)

**Risk-Adjusted TCO**:
- Add 20% contingency for build (scope creep, delays)
- Add 10% for vendor price increases (SaaS)
- Consider exit costs (switching vendors, vendor discontinuation)

### 10. Requirements Traceability

Map research findings back to requirements:

| Requirement | Research Category | Recommended Solution | Rationale |
|-------------|-------------------|---------------------|-----------|
| FR-001: User login | Authentication | GOV.UK One Login (UK Gov) OR Auth0 (private sector) | Meets SSO, MFA requirements, GDPR compliant |
| FR-015: Payment processing | Payments | GOV.UK Pay (UK Gov) OR Stripe (private sector) | PCI-DSS compliant, low transaction fees |
| NFR-P-001: Database scalability | Database | AWS RDS PostgreSQL | Handles projected 1M records, auto-scaling |
| INT-003: CRM integration | Integration | Salesforce (already used) | Native API, existing vendor |

**Show coverage**:
- X% of requirements have identified solutions
- Y requirements need custom development (no suitable products)
- Z requirements need further research

### 11. Integration with Wardley Mapping

Research findings inform Wardley Map positioning:

**Value Chain Components by Evolution**:
- **Genesis** (novel, rare): Custom-built features (unique IP)
- **Custom** (built to order): Bespoke integrations, custom workflows
- **Product** (off-the-shelf): Commercial SaaS products (Stripe, Salesforce)
- **Commodity** (standard, ubiquitous): Cloud infrastructure (AWS S3, RDS), Open source (PostgreSQL)

**Strategic Guidance**:
- Commodities: Use managed services (AWS, Azure) or open source, don't build
- Products: Buy commercial SaaS unless strong rationale to build
- Custom: Build if no product exists or requirement is unique
- Genesis: Build if competitive advantage, otherwise wait for market to mature

### 12. Integration with SOBC Economic Case

Research feeds into Strategic Outline Business Case:

**Economic Case Input**:
- **Option Analysis**: Build vs Buy vs Adopt vs Do Nothing
- **Cost Estimates**: CAPEX (initial) vs OPEX (ongoing)
- **Benefits**: Quantified benefits from vendor claims (e.g., "Stripe increases conversion 15%")
- **Risks**: Vendor lock-in, price increases, vendor viability
- **Value for Money**: Preferred option based on TCO and benefits

**Example SOBC Options**:
- **Option 0**: Do Nothing (baseline)
- **Option 1**: Build custom (highest cost, most flexible)
- **Option 2**: Buy SaaS - Vendor A (medium cost, fast delivery)
- **Option 3**: Buy SaaS - Vendor B (low cost, limited features)
- **Option 4**: Adopt open source + managed service (low cost, engineering overhead)

Preferred option should align with research recommendation.

### 13. Write the Output

- Write to `projects/{project-dir}/research-findings.md`
- Use the exact template structure from `research-findings-template.md`
- Include all identified research categories (not a fixed list)
- Include build vs buy analysis for each category
- Include TCO comparison tables
- Include requirements traceability

### 14. Summarize What You Created

Provide a summary:

**Research Summary**:
- Number of research categories identified: [X]
- Number of SaaS options researched: [Y]
- Number of open source options researched: [Z]
- UK Government platforms applicable: [List if UK Gov project]
- Build vs Buy recommendations: [X build, Y buy, Z adopt]
- Top 3 recommended vendors for shortlist: [List]
- Total 3-year TCO range: £[LOW] - £[HIGH]

**Requirements Coverage**:
- [X%] of requirements have identified solutions
- [Y] requirements need custom development
- [Z] requirements need further research

**Key Findings**:
- [Finding 1]: e.g., "GOV.UK Pay saves £25K/year vs Stripe for public sector"
- [Finding 2]: e.g., "Open source PostgreSQL TCO 40% lower than Aurora over 3 years"
- [Finding 3]: e.g., "No suitable off-the-shelf product for [unique requirement], must build"

**Next Steps**:
- Review research findings with stakeholders
- Shortlist top 2-3 vendors per category for deeper evaluation
- Run `/arckit.sow` to include research findings in RFP
- Run `/arckit.wardley` to map value chain (research informs evolution axis)
- Update SOBC Economic Case with cost data from research

## Example Usage

### Example 1: Private Sector E-commerce Project

User: `/arckit.research Research technology options for e-commerce platform project`

**You should**:
1. Read `projects/001-ecommerce-platform/requirements.md`
2. Identify categories from requirements:
   - E-commerce platform (FR-xxx mentions product catalog, checkout)
   - Payment processing (FR-xxx mentions payments, PCI-DSS in NFR-C-xxx)
   - Authentication (FR-xxx mentions user login, MFA in NFR-SEC-xxx)
   - Search (FR-xxx mentions product search)
   - Email notifications (FR-xxx mentions order confirmation emails)
   - Hosting (NFR-P-xxx mentions scalability to 10K concurrent users)
   - Analytics (BR-xxx mentions conversion rate tracking)
3. Research each category:
   - E-commerce: Shopify, WooCommerce, Magento (Buy), Custom (Build)
   - Payments: Stripe, Adyen, PayPal (Buy)
   - Authentication: Auth0, AWS Cognito (Buy), Keycloak (Adopt)
   - Search: Algolia, Elasticsearch (Buy/Adopt)
   - Email: SendGrid, AWS SES (Buy)
   - Hosting: AWS ECS, Heroku (Buy)
   - Analytics: Google Analytics, Mixpanel (Buy)
4. Build vs Buy analysis for each
5. TCO comparison: Shopify (£36K/3yr) vs WooCommerce (£45K/3yr) vs Custom Build (£180K/3yr)
6. Recommendation: Buy Shopify (fastest, lowest TCO, comprehensive features)
7. Write to `projects/001-ecommerce-platform/research-findings.md`

### Example 2: UK Government Public Service

User: `/arckit.research Research tech options for UK Government citizen portal`

**You should**:
1. Detect UK Government project (project name or requirements mention "UK Government")
2. Read `projects/002-citizen-portal/requirements.md`
3. Identify categories from requirements:
   - Authentication (FR-xxx mentions citizen login)
   - Payments (FR-xxx mentions pay council tax)
   - Notifications (FR-xxx mentions email reminders)
   - Hosting (NFR-A-xxx mentions 99.9% uptime, OFFICIAL-SENSITIVE data)
   - Forms (FR-xxx mentions application forms)
4. **Prioritize GOV.UK platforms**:
   - Authentication: **GOV.UK One Login** (MUST use for public-facing services)
   - Payments: **GOV.UK Pay** (no setup fee, 1.5% transaction fee)
   - Notifications: **GOV.UK Notify** (free for central gov)
   - Forms: **GOV.UK Forms** (free)
   - Hosting: AWS UK regions via G-Cloud framework
5. Digital Marketplace suppliers:
   - Browse G-Cloud 14 for "PaaS" or "IaaS"
   - Note: Must use Digital Marketplace for procurement
6. TCoP compliance assessment
7. TCO comparison: GOV.UK platforms (£15K/3yr) vs Commercial SaaS (£85K/3yr) vs Build (£250K/3yr)
8. Recommendation: **Use GOV.UK platforms** (mandated for citizen-facing services, lowest TCO, TCoP compliant)
9. Write to `projects/002-citizen-portal/research-findings.md`

## Important Notes

- **Research is requirements-driven**: Only research categories relevant to actual requirements
- **Dynamic category detection**: DO NOT use a fixed category list, analyze requirements to identify needs
- **UK Government MUST use GOV.UK platforms** where they exist (One Login, Pay, Notify, Forms)
- **Digital Marketplace is preferred procurement route** for UK Government
- **Technology Code of Practice compliance** is mandatory for UK Government
- **Build vs Buy is strategic**: Consider TCO, time to market, team capabilities, competitive advantage
- **Open source is NOT free**: Factor in infrastructure, setup, maintenance, and support costs
- **TCO is 3 years minimum**: Include initial + ongoing costs
- **Vendor risk matters**: Startup vs established vendor, financial viability, lock-in
- **Exit strategy**: How easy is it to switch vendors or migrate data?
- **Integration effort**: Don't underestimate integration complexity
- **Research feeds into Wardley mapping**: Evolution axis informed by commodity vs product vs custom

## Integration with Other Commands

- **Input**: Requires `requirements.md` (identifies research categories from requirements)
- **Input**: Uses `data-model.md` (understands data entities for database research)
- **Input**: Uses `stakeholder-drivers.md` (prioritizes research based on stakeholder needs)
- **Output**: Feeds into `/arckit.wardley` (evolution positioning: commodity vs product vs genesis)
- **Output**: Feeds into `/arckit.sobc` (Economic Case options and TCO data)
- **Output**: Feeds into `/arckit.sow` (RFP vendor requirements informed by research)
- **Output**: Feeds into `/arckit.hld-review` (validates technology choices against research)

## Resources

**UK Government**:
- **GOV.UK Platforms**: https://www.gov.uk/service-toolkit#gov-uk-services
- **GOV.UK One Login**: https://www.sign-in.service.gov.uk/
- **GOV.UK Pay**: https://www.payments.service.gov.uk/
- **GOV.UK Notify**: https://www.notifications.service.gov.uk/
- **Digital Marketplace**: https://www.digitalmarketplace.service.gov.uk/
- **Technology Code of Practice**: https://www.gov.uk/guidance/the-technology-code-of-practice
- **Service Manual**: https://www.gov.uk/service-manual
- **GDS Design System**: https://design-system.service.gov.uk/

**Build vs Buy**:
- **Wardley Mapping**: https://learnwardleymapping.com/
- **TCO Analysis**: Include CAPEX + OPEX + hidden costs (integration, training, exit)

Generate the research findings document now based on the project requirements.
