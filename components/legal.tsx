import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Brand from "./brand";
type Section = { title: string; paragraphs: string[] };
const privacy: Section[] = [
  {
    title: "1. Who is responsible",
    paragraphs: [
      "Lernzi is a study platform operated by [LEGAL COMPANY NAME], [BUSINESS ADDRESS], [COUNTRY], registered under [KVK NUMBER]. This organisation is the data controller for the service. Contact: [PRIVACY EMAIL]. These details must be completed before account services launch.",
    ],
  },
  {
    title: "2. What this version does",
    paragraphs: [
      "This first version works locally in your browser. It stores the notes you choose to add, question-and-answer cards, material titles, creation dates and completed study-session results. It does not retain your original files. No account service, cloud file storage, payment provider, analytics tool or advertising tracker is connected. The account forms do not send or save what you enter.",
      "Your browser stores your study data on this device. It is not automatically synchronised or backed up. The application does not send your study content to an AI service. Hosting infrastructure may receive ordinary requests, IP addresses, browser details, timestamps and security logs when serving the site. The actual hosting provider and log retention must be documented before public launch.",
    ],
  },
  {
    title: "3. Data and purposes when accounts launch",
    paragraphs: [
      "Account data: name, email address, authentication identifiers and profile changes will be used to create and operate the account, provide access and answer support requests. The intended legal basis is necessity for the service contract (GDPR Article 6(1)(b)). Password handling must be delegated to the selected authentication provider; Lernzi must not store plaintext passwords.",
      "Study material: files, extracted text, cards and practice results will be processed to provide the study features you request, on the basis of contract necessity. Cloud storage remains optional future functionality and is not active in this version. Avoid including sensitive personal information or other people’s private data in your notes.",
      "Technical and security data: limited IP, device and event information may be processed for abuse prevention, availability and troubleshooting based on legitimate interests (Article 6(1)(f)), subject to a balancing assessment and minimisation. Where a specific law requires records or disclosure, Article 6(1)(c) applies.",
      "Payments, if introduced: selected plan, payment status, transaction identifiers and legally required invoice details may be processed to perform the subscription contract and meet accounting obligations. Payment credentials should be handled by [PROCESSOR NAME], not collected directly by Lernzi. No payments are available now.",
      "Optional analytics or marketing, if introduced, will be described separately and enabled only after the required consent (Article 6(1)(a)). Acknowledging this notice does not provide consent for unrelated uses. Optional categories are off by default. No automated decisions with legal or similarly significant effects are made by this version.",
    ],
  },
  {
    title: "4. How long data is kept",
    paragraphs: [
      "Local study data remains until you delete a material, clear site storage or your browser removes it. Deleting a material in Lernzi removes its associated cards and results. Exports that you download remain under your control. Cookie preferences expire after approximately 180 days, at which point the app requests a new choice.",
      "Before remote services launch, the following schedule must be completed: active account records [RETENTION PERIOD]; deleted-account removal and backups [RETENTION PERIOD]; cloud study files [RETENTION PERIOD]; support correspondence [RETENTION PERIOD]; security logs [RETENTION PERIOD]; payment and tax records [RETENTION PERIOD / APPLICABLE LEGAL REQUIREMENT]. Retention must be no longer than necessary for the stated purpose, except for applicable legal duties or documented legal claims.",
    ],
  },
  {
    title: "5. Recipients and service providers",
    paragraphs: [
      "Local study content is not shared by this application. Future hosting [PROCESSOR NAME], authentication [PROCESSOR NAME], database/storage [PROCESSOR NAME], payment [PROCESSOR NAME] and any opted-in analytics [PROCESSOR NAME] must be listed with their purpose and role before activation. Appropriate data-processing agreements are required where providers act as processors.",
      "Authorised personnel may access only information needed for support or operation. Disclosure to authorities is limited to a valid legal obligation. Personal data is not offered for sale. A transfer of the business would require appropriate safeguards and notice.",
    ],
  },
  {
    title: "6. International processing",
    paragraphs: [
      "No claim is made that all infrastructure is within the European Economic Area. Before activating a provider, Lernzi must record processing locations, remote support access and onward transfers. Where data is transferred outside the EEA, the applicable mechanism must be identified, such as an adequacy decision or Standard Contractual Clauses with a transfer assessment and supplementary safeguards where needed. Ask [PRIVACY EMAIL] for information or a copy of applicable safeguards once the service details are finalised.",
    ],
  },
  {
    title: "7. Your rights",
    paragraphs: [
      "Depending on the processing and applicable conditions, you can request access, correction, deletion, restriction, objection and data portability. Where processing relies on legitimate interests, you may object based on your situation; objections to direct marketing must be honoured. Where consent applies, you may withdraw it at any time without affecting earlier lawful processing.",
      "You can view source notes, delete material and export local study data in the Study materials area. Account viewing, correction, export and deletion will be available once accounts are connected. For remote data requests, contact [PRIVACY EMAIL]. Only proportionate identity checks should be used. Requests are normally answered within one month; any lawful extension must be explained within that month. Some information may need to be retained under a legal obligation.",
      "You may complain to the Dutch Autoriteit Persoonsgegevens at autoriteitpersoonsgegevens.nl, or to another competent EU supervisory authority. You do not need to contact Lernzi first to use that right.",
    ],
  },
  {
    title: "8. Account deletion, security and children",
    paragraphs: [
      "No account exists in this version. When accounts launch, a deletion request must remove account and cloud study data according to the published schedule, with any legal retention exceptions explained. Deleting local browser data does not delete an independent downloaded export.",
      "The foundation avoids uploading study content and does not embed server credentials. Future hosted services require appropriate access controls, secure transport, restricted logs and backups, incident response and tested per-user storage rules. No system can promise absolute security. Anyone with access to your unlocked browser profile may be able to access local study data.",
      "Lernzi is intended for students. Before account launch, [MINIMUM AGE] and the applicable parental-authorisation process must be defined. Where consent is the basis for a service offered directly to children in the Netherlands, the relevant age and parental-authorisation requirements must be respected.",
    ],
  },
  {
    title: "9. Changes and contact",
    paragraphs: [
      "This notice was drafted on 9 September 2026 for the first-stage local application. Material changes to purposes, providers or consent choices require an updated notice and, where required, a new choice before processing begins. Contact [PRIVACY EMAIL] at [LEGAL COMPANY NAME], [BUSINESS ADDRESS], [COUNTRY].",
    ],
  },
];
const cookies: Section[] = [
  {
    title: "1. Cookies and similar storage",
    paragraphs: [
      "Cookies are small pieces of data a website stores in your browser. Similar technologies include localStorage and IndexedDB. They can remember preferences, maintain sessions or track behaviour. This policy covers these technologies, not just cookies.",
    ],
  },
  {
    title: "2. Storage used in this version",
    paragraphs: [
      "Necessary preference storage: Lernzi places lernzi.consent.v1 in localStorage to remember your optional-category choices and the date of your choice. The app asks again after approximately 180 days. This first-party entry is not sent to a third party by the application.",
      "Requested study storage: Lernzi places lernzi.study.v1 in localStorage when you add study material or complete a session. It contains notes, card pairs, material metadata and completed results. It remains until you delete the data or clear browser storage. It is used only to provide the local study feature you request; the app does not send it to third parties.",
      "Authentication cookies: none are configured in this version. If an authentication service is added, its cookie names, provider, purpose, recipients and duration must be added here before activation. Hosting and security infrastructure must also be audited before public launch, and any storage it sets must be documented.",
    ],
  },
  {
    title: "3. Optional categories",
    paragraphs: [
      "Preference cookies beyond the necessary choices above: not currently used. Analytics: not currently used. Marketing and cross-site tracking: not currently used. No optional third-party provider is installed.",
      "The preference interface records your choice, but accepting optional categories does not activate any tool in this version. Before introducing analytics or marketing, Lernzi must name each provider, describe its data and recipients, list approximate duration and transfer details, update this policy and obtain a fresh, informed choice where required. Optional categories are never pre-selected.",
    ],
  },
  {
    title: "4. Your choices",
    paragraphs: [
      "The first banner offers Accept optional, Reject optional and Manage preferences. Rejecting optional categories does not block the study space. Continuing to browse, scrolling or closing a settings window does not count as consent.",
      "Open Cookie settings in the footer to view, change or withdraw your choice. Save preferences applies the selected categories; Reject optional turns all optional categories off. Necessary storage remains available to run your requested features. If your browser blocks saving preferences, optional processing stays off.",
    ],
  },
  {
    title: "5. Clearing storage and withdrawing consent",
    paragraphs: [
      "You can also use your browser’s site-data controls to delete or block cookies and local storage. This may remove your notes and study progress and cause the banner to appear again. Export study data before clearing it. Blocking necessary storage may prevent local saving.",
      "Withdrawal affects future consent-based processing. If future providers are introduced, withdrawal must also disable their scripts and remove their accessible optional identifiers; any independent provider controls must be linked here. No such providers are active now.",
    ],
  },
  {
    title: "6. Contact and updates",
    paragraphs: [
      "Controller: [LEGAL COMPANY NAME], [BUSINESS ADDRESS], [COUNTRY], [KVK NUMBER]. Questions: [PRIVACY EMAIL]. Drafted 9 September 2026. This policy must be updated when storage or providers change. See the Privacy Policy for personal-data rights and the complaint route.",
    ],
  },
];
const terms: Section[] = [
  {
    title: "1. Lernzi and these terms",
    paragraphs: [
      "Lernzi is provided by [LEGAL COMPANY NAME], [BUSINESS ADDRESS], [COUNTRY], [KVK NUMBER]. Contact [CONTACT EMAIL]. These draft terms describe the first-stage local study application. Operator details and any future commercial terms must be finalised before accounts or subscriptions are offered.",
    ],
  },
  {
    title: "2. What you can use today",
    paragraphs: [
      "You can add supported text notes, create cards using explicit question-and-answer pairs, practise with flashcards, mark your own tests, try a timed quiz and view completed-session progress. Sample material is labelled. Accounts, password-reset delivery, PDF/Word extraction, cloud storage and payments are not connected.",
      "The application is a study aid. You are responsible for checking the accuracy, relevance and completeness of your notes and cards. Practice outcomes and self-marked scores do not guarantee understanding, exam results or coverage of every part of your source material.",
    ],
  },
  {
    title: "3. Your material and responsible use",
    paragraphs: [
      "You keep your rights in your study material. Use only material you are entitled to use and respect the privacy and intellectual-property rights of others. Do not use Lernzi to distribute unlawful content, interfere with its security or misrepresent someone else’s work as your own.",
      "This local version does not grant Lernzi ownership of your content or permission to use it for unrelated marketing or model training. Any future cloud-processing licence must be limited to providing the requested service and explained before activation.",
    ],
  },
  {
    title: "4. Storage and backups",
    paragraphs: [
      "Study data is stored in the current browser on this device. It is not automatically synchronised. Browser clearing, storage eviction, private browsing or device loss can remove it. Keep an export of important work. Original uploaded text files are not retained; extracted text and card pairs are.",
      "The first-stage limits are 20 materials, 10 MB per text file, 500,000 characters per material and 300 cards per material. Larger inputs are rejected with an explanation. These are local product limits, not paid entitlements.",
    ],
  },
  {
    title: "5. Future accounts and subscriptions",
    paragraphs: [
      "No account, paid plan or purchase is available in this version. Entering details in the account screens does not create a contract for an account or submit those details. Free, Premium and Unlimited are future plan directions, not current paid offers.",
      "Before charging, Lernzi must display the total price including applicable taxes, billing period, actual limits, renewal and cancellation terms, payment-provider details and any statutory withdrawal information. No mandatory marketing consent will be required. Payment secrets and entitlement verification must remain on a trusted server.",
    ],
  },
  {
    title: "6. Availability and liability",
    paragraphs: [
      "The service may change as it develops. Lernzi should take reasonable care to maintain the app and explain material changes, but uninterrupted or error-free availability is not promised.",
      "Nothing in these terms excludes mandatory consumer rights or liability that cannot lawfully be excluded. Any future limitation of liability must be reviewed for fairness and applicable Dutch/EU law. No exclusion for intentional wrongdoing or other non-excludable liability is intended.",
    ],
  },
  {
    title: "7. Ending use, privacy and complaints",
    paragraphs: [
      "You may stop using the local app at any time. Remove individual materials in your library or clear the site’s browser data. Delete independent exports separately if you no longer want them. A future account service must offer a clear deletion and subscription-cancellation route.",
      "The Privacy Policy and Cookie Policy explain data and choices. Questions or complaints can be sent to [CONTACT EMAIL]. Acknowledging a privacy notice is not consent to unrelated processing.",
    ],
  },
  {
    title: "8. Applicable law and changes",
    paragraphs: [
      "The intended operator is Netherlands/EU-based. Applicable law and the operator’s establishment must be confirmed before launch. A choice of Dutch law must not remove mandatory protections available to consumers in their country of residence, including applicable jurisdiction rights.",
      "Draft dated 9 September 2026. Material changes should be communicated clearly before they apply. Future paid or account features require their own complete terms, rather than silently extending these draft terms.",
    ],
  },
];
export default function Legal({ path }: { path: string }) {
  const title =
    path === "/privacy"
      ? "Privacy Policy"
      : path === "/cookies"
        ? "Cookie Policy"
        : "Terms of Service";
  const sections =
    path === "/privacy" ? privacy : path === "/cookies" ? cookies : terms;
  return (
    <div className="legal-page">
      <header>
        <Brand />
        <Link href="/" className="text-button">
          <ArrowLeft size={16} /> Back to Lernzi
        </Link>
      </header>
      <main id="main">
        <span className="eyebrow">CLEAR BY DESIGN</span>
        <h1>{title}</h1>
        <p className="legal-lead">
          A clearer picture of your choices and our responsibilities.
        </p>
        <div className="availability-note">
          <ShieldCheck size={21} />
          <span>
            Draft for the local first-stage application · 9 September 2026.
            Bracketed operator, provider and retention details must be completed
            before public account services launch.
          </span>
        </div>
        <nav className="legal-tabs" aria-label="Legal documents">
          <Link
            aria-current={path === "/privacy" ? "page" : undefined}
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            aria-current={path === "/cookies" ? "page" : undefined}
            href="/cookies"
          >
            Cookies
          </Link>
          <Link
            aria-current={path === "/terms" ? "page" : undefined}
            href="/terms"
          >
            Terms
          </Link>
        </nav>
        {sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
        <section>
          <h2>Reference information</h2>
          <p>
            <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj">
              EU General Data Protection Regulation
            </a>{" "}
            ·{" "}
            <a href="https://www.autoriteitpersoonsgegevens.nl/">
              Autoriteit Persoonsgegevens
            </a>{" "}
            ·{" "}
            <a href="https://www.autoriteitpersoonsgegevens.nl/actueel/foute-cookiebanners-aangepast-na-ingrijpen-ap">
              AP guidance on misleading cookie banners
            </a>
          </p>
          <button
            className="button secondary"
            onClick={() => window.dispatchEvent(new Event("lernzi:cookies"))}
          >
            Open cookie settings
          </button>
        </section>
      </main>
      <footer className="page-footer">
        <span>© 2026 Lernzi</span>
        <Link href="/signup">Back to create account</Link>
      </footer>
    </div>
  );
}
