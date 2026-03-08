import Layout from "../components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h1 className="font-heading text-4xl font-bold">About Us</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            SkillPath is an AI-powered career development platform designed to help students and
            job seekers transform their skills into successful careers.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            We simplify career preparation by combining intelligent technology with structured
            learning paths. Our platform guides users from skill assessment to job readiness all in
            one place.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card rounded-3xl p-6">
            <h2 className="font-heading text-2xl font-semibold">Our Mission</h2>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              To empower learners with personalized roadmaps, practical tools, and smart guidance
              so they can confidently achieve their career goals.
            </p>
          </article>

          <article className="glass-card rounded-3xl p-6">
            <h2 className="font-heading text-2xl font-semibold">Our Vision</h2>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              We envision a future where every learner has access to smart career tools that make
              professional growth simple, structured, and stress-free.
            </p>
          </article>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-heading text-2xl font-semibold">What We Offer</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] md:text-base">
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              AI Skill Gap Analysis: Identify missing skills instantly
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              Personalized Career Roadmaps: Step-by-step learning plans
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              ATS-Friendly Resume Builder: Professional resume tools
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              AI Resume Analyzer: Improve resume effectiveness
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              Mock Interview Practice: Prepare with real-world questions
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              Aptitude and Skill Prep: Practice tests and learning resources
            </li>
            <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
              Progress Tracking Dashboard: Monitor growth and achievements
            </li>
          </ul>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card rounded-3xl p-6">
            <h2 className="font-heading text-2xl font-semibold">Who It Is For</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] md:text-base">
              <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Students preparing for placements
              </li>
              <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Job seekers aiming to upskill
              </li>
              <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Career switchers exploring new domains
              </li>
              <li className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Learners who want structured guidance
              </li>
            </ul>
          </article>

          <article className="glass-card rounded-3xl p-6">
            <h2 className="font-heading text-2xl font-semibold">Contact Us</h2>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              We would love to hear from you. For questions, feedback, or partnerships, contact us:
            </p>
            <div className="mt-3 space-y-2 text-sm text-[var(--muted)] md:text-base">
              <p className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Email: support@skillpath.ai
              </p>
              <p className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Phone: +91 9014055308
              </p>
              <p className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Website: www.skillpath.ai
              </p>
              <p className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Address: SkillPath Technologies, KLH University, Hyderabad, India
              </p>
              <p className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                Support Hours: Monday to Friday, 9:00 AM to 6:00 PM IST
              </p>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
