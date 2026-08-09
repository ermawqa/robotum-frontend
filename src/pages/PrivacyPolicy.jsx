// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@/components/sections/common-sections/PageLoader";

import { useEffect, Suspense } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <main className="section-container hero-offset w-full px-6 md:px-16 py-16 font-sans section-dark-primary surface-pattern">
          <article className="prose prose-invert max-w-3xl mx-auto">
            <h1 className="heading heading-h2 font-bold mb-6">
              Privacy Policy of robotum.info
            </h1>

            <p>
              This Application (hereinafter referred to as “RoboTUM” or “this
              Application”) collects some Personal Data from its Users. This
              Privacy Policy describes how and why we collect, store, use, and
              share your information when you use our services. By using this
              Application, you agree to the collection and use of information in
              accordance with this policy.
            </p>

            <p>
              This document can be printed for reference by using the print
              command in the settings of any browser.
            </p>

            {/* 1. Owner and Data Controller */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                1. Owner and Data Controller
              </h2>
              <address className="not-italic leading-relaxed">
                RoboTUM
                <br />
                c/o NEXT Prototypes e.V.
                <br />
                Lichtenbergstr. 4a
                <br />
                85748 Garching bei München
                <br />
                Deutschland
                <br />
                Vereinsregister: VR 208020
                <br />
                Registergericht: Amtsgericht München
              </address>
              <p className="mt-2">
                Owner contact phone:{" "}
                <a
                  href="tel:+4915222178503"
                  className="text-accent hover:underline"
                >
                  +49 (0) 15222178503
                </a>
                <br />
                Owner contact email:{" "}
                <a
                  href="mailto:outreach@robotum.info"
                  className="text-accent hover:underline"
                >
                  outreach@robotum.info
                </a>
              </p>
            </section>

            {/* 2. Angaben gemäß §5 TMG */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                2. Angaben gemäß §5 TMG (German Telemedia Act)
              </h2>
              <p>
                Information in accordance with §5 TMG is provided above (see
                Owner and Data Controller).
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                Haftung für Inhalte (Liability for Content)
              </h3>
              <p>
                Als Dienstanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
                hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
                ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
                werden wir diese Inhalte umgehend entfernen.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                Haftung für Links (Liability for External Links)
              </h3>
              <p>
                Unsere Seiten enthalten Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben und für die wir keine
                Haftung übernehmen können. Für die Inhalte der verlinkten Seiten
                ist stets der jeweilige Anbieter oder Betreiber der Seiten
                verantwortlich.
              </p>
            </section>

            {/* 3. Types of Data Collected */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                3. Types of Data Collected
              </h2>

              <p>
                Among the types of Personal Data that this Application collects,
                by itself or through third parties, there are:
              </p>
              <ul>
                <li>Cookies</li>
                <li>Usage Data</li>
              </ul>

              <p>
                Complete details on each type of Personal Data collected are
                provided in the dedicated sections of this Privacy Policy or by
                specific explanation texts displayed prior to the Data
                collection.
              </p>

              <ol>
                <li>
                  <strong>Freely Provided Data:</strong> Personal Data may be
                  freely provided by the User (for example, when contacting
                  RoboTUM).
                </li>
                <li>
                  <strong>Usage Data:</strong> Collected automatically when
                  using this Application (e.g., IP addresses, browser type,
                  operating system).
                </li>
              </ol>

              <p>
                Unless specified otherwise, all Data requested by this
                Application is mandatory. Failure to provide this Data may make
                it impossible for this Application to provide its services.
                Where this Application specifically states Data is not
                mandatory, Users are free not to communicate that Data without
                consequences to the availability or the functioning of the
                Service. Users who are uncertain about which Personal Data is
                mandatory are welcome to contact the Owner.
              </p>

              <p>
                Any use of Cookies – or of other tracking tools – by this
                Application or by the owners of third-party services used by
                this Application serves the purpose of providing the Service
                required by the User, in addition to any other purposes
                described in this document and in the Cookie Policy (if
                available).
              </p>

              <p>
                Users are responsible for any third-party Personal Data
                obtained, published, or shared through this Application and
                confirm that they have the third party’s consent to provide the
                Data to the Owner.
              </p>
            </section>

            {/* 4. Mode and Place of Processing the Data */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                4. Mode and Place of Processing the Data
              </h2>

              <h3 className="text-text1 font-semibold mt-4">
                Methods of Processing
              </h3>
              <p>
                The Owner takes appropriate security measures to prevent
                unauthorized access, disclosure, modification, or unauthorized
                destruction of the Data.
              </p>
              <p>
                Data processing is carried out using computers and/or IT-enabled
                tools, following organizational procedures and modes strictly
                related to the purposes indicated. In addition to the Owner, in
                some cases, the Data may be accessible to certain types of
                persons in charge involved with the operation of this
                Application (administration, sales, marketing, legal, system
                administration) or external parties (such as third-party
                technical service providers, mail carriers, hosting providers,
                IT companies, communications agencies) appointed, if necessary,
                as Data Processors by the Owner. The updated list of these
                parties may be requested from the Owner at any time.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                Legal Basis of Processing
              </h3>
              <p>
                The Owner may process Personal Data relating to Users if one of
                the following applies:
              </p>
              <ul>
                <li>
                  Users have given their consent for one or more specific
                  purposes.
                </li>
                <li>
                  Provision of Data is necessary for the performance of a
                  contract with the User and/or for any pre-contractual
                  obligations.
                </li>
                <li>
                  Processing is necessary for compliance with a legal obligation
                  to which the Owner is subject.
                </li>
                <li>
                  Processing is related to a task that is carried out in the
                  public interest or in the exercise of official authority
                  vested in the Owner.
                </li>
                <li>
                  Processing is necessary for the purposes of the legitimate
                  interests pursued by the Owner or by a third party.
                </li>
              </ul>
              <p>
                In any case, the Owner will gladly help to clarify the specific
                legal basis that applies to the processing. In particular,
                whether the provision of Personal Data is a statutory or
                contractual requirement, or a requirement necessary to enter
                into a contract.
              </p>

              <h3 className="text-text1 font-semibold mt-4">Place</h3>
              <p>
                The Data is processed at the Owner’s operating offices and in
                any other places where the parties involved in the processing
                are located.
              </p>
              <p>
                Depending on the User’s location, data transfers may involve
                transferring the User’s Data to a country other than their own.
                To find out more about such transfers, Users can check the
                relevant sections of this document or inquire with the Owner.
              </p>

              <h3 className="text-text1 font-semibold mt-4">Retention Time</h3>
              <p>
                Personal Data shall be processed and stored for as long as
                required by the purpose they have been collected for. Therefore:
              </p>
              <ul>
                <li>
                  Personal Data collected for contract performance between the
                  Owner and the User shall be retained until such contract has
                  been fully performed.
                </li>
                <li>
                  Personal Data collected for the purposes of the Owner’s
                  legitimate interests shall be retained as long as needed to
                  fulfill such purposes.
                </li>
              </ul>
              <p>
                The Owner may be allowed to retain Personal Data for a longer
                period whenever the User has given consent to such processing
                and such consent is not withdrawn. Furthermore, the Owner may be
                obliged to retain Personal Data for a longer period whenever
                required by law or by an order of an authority.
              </p>
              <p>
                Once the retention period expires, Personal Data shall be
                deleted. Therefore, the right to access, erasure, rectification,
                and data portability cannot be enforced after the expiration of
                the retention period.
              </p>
            </section>

            {/* 5. The Purposes of Processing */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                5. The Purposes of Processing
              </h2>
              <p>
                The Data concerning the User is collected to allow the Owner to:
              </p>
              <ul>
                <li>Provide its Service</li>
                <li>Comply with its legal obligations</li>
                <li>Respond to enforcement requests</li>
                <li>
                  Protect its rights and interests (or those of its Users or
                  third parties)
                </li>
                <li>Detect malicious or fraudulent activity</li>
                <li>Conduct Analytics</li>
              </ul>
              <p>
                For specific information about the Personal Data used for each
                purpose, the User may refer to the section “Detailed Information
                on the Processing of Personal Data.”
              </p>
            </section>

            {/* 6. Detailed Information on the Processing of Personal Data */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                6. Detailed Information on the Processing of Personal Data
              </h2>

              <h3 className="text-text1 font-semibold mt-2">Analytics</h3>
              <p>
                This Application may use third-party analytics tools to monitor
                and analyze web traffic. These tools help us understand how
                Users interact with this Application, so we can improve its
                functionality and user experience. The Personal Data collected
                can include cookies and Usage Data (e.g., pages visited, time
                spent on each page, and other similar information).
              </p>
            </section>

            {/* 7. The Rights of Users */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                7. The Rights of Users
              </h2>
              <p>
                Users may exercise certain rights regarding their Data processed
                by the Owner. In particular, Users have the right to do the
                following:
              </p>
              <ol>
                <li>Withdraw their consent at any time.</li>
                <li>
                  Object to processing of their Data. Users have the right to
                  object if the processing is carried out on a legal basis other
                  than consent.
                </li>
                <li>Access their Data.</li>
                <li>Verify and seek rectification.</li>
                <li>Restrict the processing of their Data.</li>
                <li>Have their Personal Data deleted or otherwise removed.</li>
                <li>
                  Receive their Data and have it transferred to another
                  controller.
                </li>
                <li>
                  Lodge a complaint. Users have the right to bring a claim
                  before their competent data protection authority.
                </li>
              </ol>

              <h3 className="text-text1 font-semibold mt-4">
                Details About the Right to Object to Processing
              </h3>
              <p>
                Where Personal Data is processed for a public interest, in the
                exercise of an official authority vested in the Owner, or for
                the legitimate interests pursued by the Owner, Users may object
                to such processing by providing a ground related to their
                particular situation.
              </p>
              <p>
                Users must know that, however, should their Personal Data be
                processed for direct marketing purposes, they can object to that
                processing at any time without providing any justification.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                How to Exercise These Rights
              </h3>
              <p>
                Any requests to exercise User rights can be directed to the
                Owner through the contact details provided in this document.
                These requests can be exercised free of charge and will be
                addressed as early as possible and always within one month.
              </p>
            </section>

            {/* 8. Additional Information About Data Collection and Processing */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                8. Additional Information About Data Collection and Processing
              </h2>

              <h3 className="text-text1 font-semibold mt-2">Legal Action</h3>
              <p>
                The User’s Personal Data may be used for legal purposes by the
                Owner in Court or in the stages leading to possible legal action
                arising from improper use of this Application or the related
                Services. The User declares to be aware that the Owner may be
                required to reveal personal data upon request of public
                authorities.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                Additional Information About User’s Personal Data
              </h3>
              <p>
                In addition to the information contained in this Privacy Policy,
                this Application may provide the User with additional and
                contextual information concerning particular Services or the
                collection and processing of Personal Data upon request.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                System Logs and Maintenance
              </h3>
              <p>
                For operation and maintenance purposes, this Application and any
                third-party services may collect files that record interaction
                with this Application (System logs) or use other Personal Data
                (such as the IP Address) for this purpose.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                Information Not Contained in This Policy
              </h3>
              <p>
                More details concerning the collection or processing of Personal
                Data may be requested from the Owner at any time. Please see the
                contact information at the beginning of this document.
              </p>

              <h3 className="text-text1 font-semibold mt-4">
                How “Do Not Track” Requests Are Handled
              </h3>
              <p>
                This Application does not support “Do Not Track” requests. To
                determine whether any of the third-party services used honor “Do
                Not Track” requests, please read their privacy policies.
              </p>
            </section>

            {/* 9. Changes to This Privacy Policy */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                9. Changes to This Privacy Policy
              </h2>
              <p>
                The Owner reserves the right to make changes to this Privacy
                Policy at any time by notifying its Users on this page, within
                this Application, and/or-if technically and legally feasible-by
                sending a notice via any contact information available to the
                Owner. It is strongly recommended to check this page often.
              </p>
              <p>
                Should the changes affect processing activities performed on the
                basis of the User’s consent, the Owner shall collect new consent
                from the User, where required.
              </p>
            </section>

            {/* 10. Definitions and Legal References */}
            <section className="mb-10">
              <h2 className="text-text1 font-semibold">
                10. Definitions and Legal References
              </h2>
              <ul>
                <li>
                  <strong>Personal Data (or Data):</strong> Any information that
                  directly, indirectly, or in connection with other information
                  allows for the identification of a natural person.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information collected
                  automatically through this Application (or third-party
                  services employed in this Application), which can include: the
                  IP addresses or domain names of the computers utilized by the
                  Users, the URI addresses, the time of the request, etc.
                </li>
                <li>
                  <strong>User:</strong> The individual using this Application
                  who must coincide with or be authorized by the Data Subject.
                </li>
                <li>
                  <strong>Data Subject:</strong> The natural person to whom the
                  Personal Data refers.
                </li>
                <li>
                  <strong>Data Processor (or Data Supervisor):</strong> The
                  natural or legal person, public authority, agency, or other
                  body which processes Personal Data on behalf of the
                  Controller.
                </li>
                <li>
                  <strong>Data Controller (or Owner):</strong> The natural or
                  legal person, public authority, agency, or other body which,
                  alone or jointly with others, determines the purposes and
                  means of the processing of Personal Data.
                </li>
              </ul>
            </section>

            {/* Latest update and contact */}
            <p className="text-white/80">Latest update: January 07, 2025</p>

            <p className="mt-4">
              If you have any questions about this Privacy Policy, please
              contact RoboTUM at:
              <br />
              Email:{" "}
              <a
                href="mailto:outreach@robotum.info"
                className="text-accent hover:underline"
              >
                outreach@robotum.info
              </a>
              <br />
              Phone:{" "}
              <a
                href="tel:+4915222178503"
                className="text-accent hover:underline"
              >
                +49 (0) 15222178503
              </a>
            </p>
          </article>
        </main>
      </Suspense>
      <FooterSection />
    </>
  );
}
