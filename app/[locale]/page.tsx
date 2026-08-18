import { resolveLocale } from "@/lib/i18n/params";
import { getSectionContent } from "@/lib/data/content";
import {
  getProfile,
  getVisibleSections,
  getVisibleSkills,
  getVisibleExperiences,
  getFeaturedProjects,
  getPublishedCertificates,
  getVisibleAwards,
  getVisibleEducation,
  getVisibleGalleryImages,
  getVisibleTestimonials,
  getVisibleStatistics,
} from "@/lib/data/public";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { Skills } from "@/components/public/skills";
import { ExperienceSection } from "@/components/public/experience";
import { ProjectsSection } from "@/components/public/projects-section";
import { CertificatesSection } from "@/components/public/certificates-section";
import { AwardsSection } from "@/components/public/awards-section";
import { EducationSection } from "@/components/public/education-section";
import { GallerySection } from "@/components/public/gallery-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { StatsSection } from "@/components/public/stats-section";
import { ContactSection } from "@/components/public/contact-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  const [
    profile,
    sections,
    skills,
    experiences,
    projects,
    certificates,
    awards,
    education,
    gallery,
    testimonials,
    stats,
  ] = await Promise.all([
    getProfile(),
    getVisibleSections(),
    getVisibleSkills(),
    getVisibleExperiences(),
    getFeaturedProjects(),
    getPublishedCertificates(),
    getVisibleAwards(),
    getVisibleEducation(),
    getVisibleGalleryImages(),
    getVisibleTestimonials(),
    getVisibleStatistics(),
  ]);

  const contentBySection = Object.fromEntries(
    await Promise.all(
      sections.map(async (s) => [s.id, await getSectionContent(s.id, locale)] as const)
    )
  );

  const renderers: Record<string, () => React.ReactNode> = {
    hero: () => (
      <Hero key="hero" profile={profile} content={contentBySection.hero ?? {}} />
    ),
    about: () => (
      <About key="about" profile={profile} content={contentBySection.about ?? {}} />
    ),
    skills: () => (
      <Skills key="skills" skills={skills} content={contentBySection.skills ?? {}} />
    ),
    experience: () => (
      <ExperienceSection
        key="experience"
        experiences={experiences}
        content={contentBySection.experience ?? {}}
      />
    ),
    projects: () => (
      <ProjectsSection
        key="projects"
        projects={projects}
        content={contentBySection.projects ?? {}}
        locale={locale}
      />
    ),
    certificates: () => (
      <CertificatesSection
        key="certificates"
        certificates={certificates}
        content={contentBySection.certificates ?? {}}
      />
    ),
    awards: () => (
      <AwardsSection key="awards" awards={awards} content={contentBySection.awards ?? {}} />
    ),
    education: () => (
      <EducationSection
        key="education"
        education={education}
        content={contentBySection.education ?? {}}
      />
    ),
    gallery: () => (
      <GallerySection key="gallery" images={gallery} content={contentBySection.gallery ?? {}} />
    ),
    testimonials: () => (
      <TestimonialsSection
        key="testimonials"
        testimonials={testimonials}
        content={contentBySection.testimonials ?? {}}
      />
    ),
    stats: () => (
      <StatsSection key="stats" stats={stats} content={contentBySection.stats ?? {}} />
    ),
    contact: () => (
      <ContactSection key="contact" profile={profile} content={contentBySection.contact ?? {}} />
    ),
  };

  return <>{sections.map((s) => renderers[s.id]?.())}</>;
}
