export const metadata = {
  title: "Meet the Founder and Developer | EduForge",
  description: "Kevin Nyambega Mongare, founder and developer of EduForge Learning Hub.",
};

// ====== EDIT THESE ======
const NAME = "Kevin Nyambega Mongare";
const ROLE = "Founder and Developer of EduForge Learning Hub";
const QUALIFICATION = "Bachelor of Education Technology (Mechanical Engineering)";
const INSTITUTION = "Masinde Muliro University of Science and Technology";

const VISION =
  "To make quality, curriculum-guided learning and training easy to reach for every learner, from school to TVET and university, in one trusted platform.";

const MESSAGE =
  "EduForge was built so that learners, teachers and trainers can find approved learning materials, practise, assess and grow in one place. Thank you for being part of it.";

const EXPERTISE = [
  "Mechanical Technology and Mechanical Production",
  "Welding and fabrication",
  "Curriculum implementation",
  "TVET training",
  "Digital learning and educational technology",
];

// Leave a value empty ("") to hide that link.
const EMAIL = "nyambegakevin27@gmail.com";
const PHONE = "+254729774487";
const PHONE_DISPLAY = "0729 774 487";
const WHATSAPP = "254729774487"; // digits only
const PORTFOLIO = "https://nyambega-cmd.github.io/Portifolio/";
// ========================

type Contact = { label: string; text: string; href: string; primary?: boolean };

const contacts: Contact[] = [
  { label: "WhatsApp", text: "Chat on WhatsApp", href: WHATSAPP ? `https://wa.me/${WHATSAPP}` : "", primary: true },
  { label: "Email", text: EMAIL, href: EMAIL ? `mailto:${EMAIL}` : "" },
  { label: "Phone", text: PHONE_DISPLAY, href: PHONE ? `tel:${PHONE}` : "" },
  { label: "Portfolio", text: "View my work", href: PORTFOLIO },
].filter((c) => c.href);

const external = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-leaf" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.58 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
    </svg>
  );
}

export default function Founder() {
  const band = contacts.filter((c) => c.label === "WhatsApp" || c.label === "Email");
  return (
    <main>
      {/* HERO */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[340px_1fr] md:py-20">
          <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
            <div className="rounded-3xl bg-gradient-to-br from-ember to-ember/30 p-1.5 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/founder/kevin-nyambega-mongare.jpg"
                alt={NAME}
                className="aspect-[4/5] w-full rounded-[1.35rem] object-cover object-center"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-sm font-semibold uppercase tracking-widest text-ember">Meet the Founder and Developer</h1>
            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{NAME}</h2>
            <p className="mt-2 text-lg text-white/80">{ROLE}</p>

            <p className="mx-auto mt-6 max-w-prose text-white/90 md:mx-0">
              Kevin holds a {QUALIFICATION} and works across education, curriculum implementation, and technical and
              vocational training, with experience linked to {INSTITUTION}.
            </p>

            {contacts.length > 0 && (
              <ul className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                {contacts.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...external(c.href)}
                      className={
                        c.primary
                          ? "inline-flex items-center rounded-md bg-ember px-5 py-2.5 font-semibold text-ink transition hover:brightness-110"
                          : "inline-flex items-center rounded-md border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
                      }
                    >
                      {c.label === "WhatsApp" || c.label === "Portfolio" ? c.text : `${c.label}: ${c.text}`}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h3 className="text-2xl font-bold">Areas of expertise</h3>
        <div className="mt-2 h-1 w-12 rounded bg-ember" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {EXPERTISE.map((x) => (
            <li key={x} className="flex items-start gap-3 rounded-xl border border-steel/20 bg-white p-4 shadow-sm">
              <Check />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* VISION + MESSAGE */}
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-14 md:grid-cols-2">
        <article className="rounded-xl border-l-4 border-ember bg-white p-7 shadow-sm">
          <h3 className="text-xl font-bold">Vision</h3>
          <p className="mt-3 leading-relaxed text-ink/90">{VISION}</p>
        </article>
        <article className="rounded-xl border-l-4 border-leaf bg-white p-7 shadow-sm">
          <h3 className="text-xl font-bold">A message from the founder</h3>
          <p className="mt-3 leading-relaxed text-ink/90">{MESSAGE}</p>
          <p className="mt-4 font-semibold">{NAME}</p>
          <p className="text-sm text-steel">{ROLE}</p>
        </article>
      </section>

      {/* CONTACT BAND */}
      {band.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-ink p-8 text-white md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Get in touch</h3>
              <p className="mt-1 text-white/80">Questions, partnerships or feedback on EduForge are welcome.</p>
            </div>
            <ul className="flex flex-wrap justify-center gap-3">
              {band.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...external(c.href)}
                    className="inline-flex items-center rounded-md bg-ember px-5 py-2.5 font-semibold text-ink transition hover:brightness-110"
                  >
                    {c.label === "WhatsApp" ? "WhatsApp" : "Email Kevin"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
