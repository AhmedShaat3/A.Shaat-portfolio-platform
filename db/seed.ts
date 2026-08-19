import "dotenv/config";

import { db, client } from "./client";
import {
  users,
  profile,
  siteSettings,
  contentBlocks,
  navigationItems,
  sections,
  socialLinks,
  skills,
  experiences,
  education,
  projects,
  certificates,
  awards,
  testimonials,
  galleryImages,
  statistics,
} from "./schema";
import { hashPassword } from "@/lib/auth/password";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@portfolio.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  // Check if admin already exists
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail.toLowerCase()));
  
  if (existingAdmin.length > 0) {
    console.log("✅ Admin already exists:", adminEmail);
  } else {
    await db.insert(users).values({
      id: randomUUID(),
      name: "Big Boss",
      email: adminEmail.toLowerCase(),
      passwordHash: await hashPassword(adminPassword),
      role: "admin",
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
    });
    console.log("✅ Admin created:", adminEmail);
  }

  // --- PROFILE ----------------------------------------------------------
  const existingProfile = await db.select().from(profile).where(eq(profile.id, "profile"));
  if (existingProfile.length === 0) {
    await db.insert(profile).values({
      id: "profile",
      fullName: "Big Boss",
      title: "Cybersecurity • AI • Software Engineering",
      tagline:
        "IT student specializing in cybersecurity, building secure, intelligent, and scalable software.",
      typingPhrases: JSON.stringify([
        "Building secure digital experiences.",
        "Exploring AI and intelligent systems.",
        "Engineering secure and scalable solutions.",
        "Turning ideas into technology.",
      ]),
      bio:
        "<p>I'm an Information Technology student at Saudi Electronic University, specializing in Cybersecurity, with a strong interest in Artificial Intelligence and Software Engineering. I completed my cooperative training at AlHaya Medical Company (AMCO), where I worked on practical projects spanning AI integration, secure system design, and web development.</p><p>I'm drawn to the intersection of security and intelligent systems &mdash; how to build software that is not just functional, but resilient, private, and trustworthy by design.</p>",
      mission:
        "To build technology that is secure by default and useful by design &mdash; bridging cybersecurity discipline with modern AI and software engineering practice.",
      values: JSON.stringify([
        "Security as a first-class requirement, not an afterthought",
        "Continuous, hands-on learning",
        "Clear, honest communication about what a system can and cannot do",
        "Practical, production-minded engineering over theory alone",
      ]),
      avatarUrl: null,
      resumeUrl: null,
      email: "contact@example.com",
      phone: "+966 5X XXX XXXX",
      location: "Riyadh, Saudi Arabia",
      githubUrl: "https://github.com/",
      linkedinUrl: "https://linkedin.com/",
      twitterUrl: null,
      mapEmbedUrl: null,
    });
    console.log("✅ Profile created");
  }

  // --- SITE SETTINGS ------------------------------------------------------
  const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, "settings"));
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      id: "settings",
      siteTitle: "Big Boss — Cybersecurity & AI Engineer",
      siteDescription:
        "Portfolio of Big Boss — Cybersecurity, AI, and Software Engineering student and builder.",
      keywords:
        "cybersecurity, artificial intelligence, software engineering, penetration testing, Saudi Electronic University",
      author: "Big Boss",
      defaultLocale: "en",
      publicTheme: "dark",
      adminTheme: "light",
      primaryColor: "#29d8f0",
      logoText: "BB",
      publishedVersion: "1.0",
      lastPublishedAt: new Date(),  // ✅ تم التعديل
    });
    console.log("✅ Site settings created");
  }

  // --- CONTENT BLOCKS ---------------------------------------------------
  const contentSeed: Array<{
    section: string;
    key: string;
    en: string;
    ar: string;
  }> = [
    {
      section: "hero",
      key: "eyebrow",
      en: "AVAILABLE FOR OPPORTUNITIES",
      ar: "متاح لفرص عمل",
    },
    {
      section: "about",
      key: "heading",
      en: "About Me",
      ar: "نبذة عني",
    },
    {
      section: "about",
      key: "subheading",
      en: "Cybersecurity-minded, AI-curious, and building real software.",
      ar: "أهتم بالأمن السيبراني، وأستكشف الذكاء الاصطناعي، وأبني برمجيات حقيقية.",
    },
    {
      section: "skills",
      key: "heading",
      en: "Skills & Expertise",
      ar: "المهارات والخبرات",
    },
    {
      section: "skills",
      key: "subheading",
      en: "Tools and technologies I use to design, secure, and ship software.",
      ar: "الأدوات والتقنيات التي أستخدمها لتصميم البرمجيات وتأمينها وإطلاقها.",
    },
    {
      section: "experience",
      key: "heading",
      en: "Experience",
      ar: "الخبرة العملية",
    },
    {
      section: "projects",
      key: "heading",
      en: "Featured Projects",
      ar: "مشاريع مميزة",
    },
    {
      section: "projects",
      key: "subheading",
      en: "A selection of cybersecurity, AI, and software engineering projects.",
      ar: "مجموعة مختارة من مشاريع الأمن السيبراني والذكاء الاصطناعي والهندسة البرمجية.",
    },
    {
      section: "certificates",
      key: "heading",
      en: "Certificates",
      ar: "الشهادات",
    },
    {
      section: "awards",
      key: "heading",
      en: "Awards & Achievements",
      ar: "الجوائز والإنجازات",
    },
    {
      section: "education",
      key: "heading",
      en: "Education",
      ar: "التعليم",
    },
    {
      section: "gallery",
      key: "heading",
      en: "Gallery",
      ar: "معرض الصور",
    },
    {
      section: "testimonials",
      key: "heading",
      en: "Testimonials",
      ar: "آراء",
    },
    {
      section: "stats",
      key: "heading",
      en: "By the Numbers",
      ar: "بالأرقام",
    },
    {
      section: "contact",
      key: "heading",
      en: "Get In Touch",
      ar: "تواصل معي",
    },
    {
      section: "contact",
      key: "subheading",
      en: "Have a project, an opportunity, or just want to talk security and AI? My inbox is open.",
      ar: "لديك مشروع أو فرصة، أو تريد فقط الحديث عن الأمن السيبراني والذكاء الاصطناعي؟ صندوق الوارد لدي مفتوح.",
    },
  ];

  for (const c of contentSeed) {
    const existing = await db.select().from(contentBlocks).where(
      and(
        eq(contentBlocks.section, c.section),
        eq(contentBlocks.key, c.key),
        eq(contentBlocks.locale, "en")
      )
    );
    if (existing.length === 0) {
      await db.insert(contentBlocks).values([
        { id: randomUUID(), section: c.section, key: c.key, locale: "en", value: c.en },
        { id: randomUUID(), section: c.section, key: c.key, locale: "ar", value: c.ar },
      ]);
    }
  }
  console.log("✅ Content blocks created");

  // --- NAVIGATION ---------------------------------------------------------
  const navSeed = [
    { labelEn: "About", labelAr: "نبذة عني", url: "#about" },
    { labelEn: "Skills", labelAr: "المهارات", url: "#skills" },
    { labelEn: "Experience", labelAr: "الخبرات", url: "#experience" },
    { labelEn: "Projects", labelAr: "المشاريع", url: "#projects" },
    { labelEn: "Certificates", labelAr: "الشهادات", url: "#certificates" },
    { labelEn: "Contact", labelAr: "تواصل", url: "#contact" },
  ];
  
  const existingNav = await db.select().from(navigationItems);
  if (existingNav.length === 0) {
    for (let i = 0; i < navSeed.length; i++) {
      await db.insert(navigationItems).values({
        id: randomUUID(),
        ...navSeed[i],
        order: i,
        visible: true,
        openInNewTab: false,
      });
    }
    console.log("✅ Navigation created");
  }

  // --- SECTIONS -----------------------------------------------------------
  const sectionSeed = [
    "hero",
    "about",
    "skills",
    "experience",
    "projects",
    "certificates",
    "awards",
    "education",
    "gallery",
    "testimonials",
    "stats",
    "contact",
  ];
  
  const existingSections = await db.select().from(sections);
  if (existingSections.length === 0) {
    for (let i = 0; i < sectionSeed.length; i++) {
      await db.insert(sections).values({
        id: sectionSeed[i],
        labelEn: sectionSeed[i][0].toUpperCase() + sectionSeed[i].slice(1),
        order: i,
        visible: true,
      });
    }
    console.log("✅ Sections created");
  }

  // --- SOCIAL LINKS ---------------------------------------------------------
  const socials = [
    { platform: "github", url: "https://github.com/", icon: "github" },
    { platform: "linkedin", url: "https://linkedin.com/", icon: "linkedin" },
    { platform: "email", url: "mailto:contact@example.com", icon: "email" },
  ];
  
  const existingSocials = await db.select().from(socialLinks);
  if (existingSocials.length === 0) {
    for (let i = 0; i < socials.length; i++) {
      await db.insert(socialLinks).values({ id: randomUUID(), ...socials[i], order: i, visible: true });
    }
    console.log("✅ Social links created");
  }

  // --- SKILLS ---------------------------------------------------------------
  const skillSeed: Array<{
    name: string;
    category: string;
    icon: string;
    proficiency: number;
  }> = [
    { name: "Network Security", category: "Cybersecurity", icon: "shield", proficiency: 80 },
    { name: "Penetration Testing", category: "Cybersecurity", icon: "shield-alert", proficiency: 70 },
    { name: "Wireshark", category: "Cybersecurity", icon: "activity", proficiency: 75 },
    { name: "Nmap", category: "Cybersecurity", icon: "radar", proficiency: 78 },
    { name: "OpenVAS", category: "Cybersecurity", icon: "bug", proficiency: 65 },
    { name: "Artificial Intelligence", category: "Artificial Intelligence", icon: "brain-circuit", proficiency: 72 },
    { name: "AI Integration (LLMs)", category: "Artificial Intelligence", icon: "sparkles", proficiency: 75 },
    { name: "Python", category: "Software Engineering", icon: "code", proficiency: 85 },
    { name: "Java", category: "Software Engineering", icon: "coffee", proficiency: 70 },
    { name: "JavaScript", category: "Software Engineering", icon: "file-code", proficiency: 82 },
    { name: "TypeScript", category: "Software Engineering", icon: "file-code-2", proficiency: 80 },
    { name: "React & Next.js", category: "Web Development", icon: "layout-panel-left", proficiency: 82 },
    { name: "HTML & CSS", category: "Web Development", icon: "layout-template", proficiency: 88 },
    { name: "SQL", category: "Web Development", icon: "database", proficiency: 78 },
    { name: "TCP/IP & Networking", category: "Networking", icon: "network", proficiency: 76 },
    { name: "Linux", category: "Networking", icon: "terminal-square", proficiency: 80 },
    { name: "Windows Server", category: "Networking", icon: "server", proficiency: 70 },
    { name: "AWS", category: "Cloud", icon: "cloud", proficiency: 65 },
    { name: "Cloud Computing", category: "Cloud", icon: "cloud-cog", proficiency: 68 },
    { name: "DevOps", category: "DevOps", icon: "git-branch", proficiency: 68 },
    { name: "Git & GitHub", category: "DevOps", icon: "github", proficiency: 85 },
    { name: "Power BI", category: "Data", icon: "bar-chart-3", proficiency: 70 },
    { name: "Microsoft Power Platform", category: "Data", icon: "layout-grid", proficiency: 65 },
    { name: "SAP", category: "Data", icon: "database-zap", proficiency: 55 },
    { name: "SharePoint", category: "Data", icon: "folder-cog", proficiency: 60 },
  ];
  
  const existingSkills = await db.select().from(skills);
  if (existingSkills.length === 0) {
    for (let i = 0; i < skillSeed.length; i++) {
      await db.insert(skills).values({
        id: randomUUID(),
        ...skillSeed[i],
        description: null,
        order: i,
        visible: true,
      });
    }
    console.log("✅ Skills created");
  }

  // --- EXPERIENCE -------------------------------------------------------
  const existingExperience = await db.select().from(experiences);
  if (existingExperience.length === 0) {
    await db.insert(experiences).values({
      id: randomUUID(),
      company: "AlHaya Medical Company (AMCO)",
      position: "Cooperative Trainee — IT Department",
      description:
        "<p>Completed 120 hours of cooperative training in the IT department, contributing to internal tooling and AI-integration projects under supervision.</p><p>Worked hands-on across the software development lifecycle: requirements, implementation, testing, and internal demos.</p>",
      startDate: "2025-01",
      endDate: "2025-04",
      technologies: JSON.stringify(["Python", "JavaScript", "SQL", "AI/LLM integration"]),
      achievements: JSON.stringify([
        "Contributed to an AI Gateway integration project",
        "Assisted in building an internal appointment system",
        "Practiced secure development and internal-data handling processes",
      ]),
      location: "Riyadh, Saudi Arabia",
      order: 0,
      visible: true,
    });
    console.log("✅ Experience created");
  }

  // --- EDUCATION ----------------------------------------------------------
  const existingEducation = await db.select().from(education);
  if (existingEducation.length === 0) {
    await db.insert(education).values({
      id: randomUUID(),
      university: "Saudi Electronic University",
      degree: "Bachelor of Science in Information Technology",
      major: "Cybersecurity",
      gpa: null,
      startYear: "2023",
      endYear: "2027",
      coursework: JSON.stringify([
        "Network Security",
        "IT Project Management",
        "Enterprise Systems",
        "Database Systems",
        "Software Engineering",
      ]),
      description:
        "Specializing in cybersecurity within an IT degree program, with coursework spanning networking, enterprise systems, and secure software design.",
      order: 0,
      visible: true,
    });
    console.log("✅ Education created");
  }

  // --- PROJECTS -------------------------------------------------------------
  const projectSeed: Array<{
    title: string;
    category: string;
    short: string;
    full: string;
    technologies: string[];
    status: string;
    featured: boolean;
  }> = [
    {
      title: "AI Gateway",
      category: "AI",
      short:
        "An on-premises AI gateway that routes requests to local models, keeping sensitive data off third-party servers.",
      full:
        "<p>Designed and built an AI Gateway REST API to give an internal team access to AI capabilities without sending data to external providers. The gateway sits in front of locally hosted models and exposes a simple, consistent API to internal applications.</p>",
      technologies: ["Docker", "REST API", "Local LLMs", "Postman"],
      status: "completed",
      featured: true,
    },
    {
      title: "AI File Organizer",
      category: "AI",
      short: "A tool that uses AI to automatically classify and organize files by content, not just filename.",
      full:
        "<p>Built a utility that inspects file contents and metadata and uses an AI model to suggest and apply an organized folder structure, reducing manual file management.</p>",
      technologies: ["Python", "AI/LLM"],
      status: "completed",
      featured: true,
    },
    {
      title: "Clinic Appointment System",
      category: "Web Development",
      short: "A booking system for scheduling and managing patient appointments.",
      full:
        "<p>Developed a web-based appointment scheduling system, covering booking, rescheduling, and basic patient/provider record management.</p>",
      technologies: ["JavaScript", "SQL", "HTML", "CSS"],
      status: "completed",
      featured: true,
    },
    {
      title: "Port Scanner GUI",
      category: "Cybersecurity",
      short: "A graphical front-end for network port scanning, built for learning offensive security fundamentals.",
      full:
        "<p>Built a GUI wrapper around common network scanning techniques to visualize open ports and services on a target host, as a hands-on way to learn reconnaissance fundamentals.</p>",
      technologies: ["Python", "Networking", "TCP/IP"],
      status: "completed",
      featured: false,
    },
    {
      title: "Penetration Testing Labs",
      category: "Cybersecurity",
      short: "A set of guided penetration-testing exercises across common vulnerability classes.",
      full:
        "<p>Worked through structured penetration testing exercises covering reconnaissance, scanning, and exploitation of intentionally vulnerable lab environments, using Nmap, Wireshark, and OpenVAS.</p>",
      technologies: ["Nmap", "Wireshark", "OpenVAS"],
      status: "completed",
      featured: false,
    },
    {
      title: "Database Design Projects",
      category: "Other",
      short: "Relational database design and query projects completed as part of coursework.",
      full: "<p>A collection of relational database design and SQL query projects covering normalization, indexing, and query optimization fundamentals.</p>",
      technologies: ["SQL", "Database Design"],
      status: "completed",
      featured: false,
    },
  ];

  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    for (let i = 0; i < projectSeed.length; i++) {
      const p = projectSeed[i];
      const slug = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      await db.insert(projects).values({
        id: randomUUID(),
        title: p.title,
        slug,
        shortDescription: p.short,
        fullDescription: p.full,
        category: p.category,
        technologies: JSON.stringify(p.technologies),
        mainImageUrl: null,
        githubUrl: "https://github.com/",
        liveUrl: null,
        featured: p.featured,
        status: p.status,
        stats: JSON.stringify([]),
        challenges: "<p>Placeholder — describe the main challenge of this project here from the admin dashboard.</p>",
        solution: "<p>Placeholder — describe the approach and solution here from the admin dashboard.</p>",
        results: "<p>Placeholder — describe measurable results or outcomes here from the admin dashboard.</p>",
        seoTitle: p.title,
        seoDescription: p.short,
        order: i,
        published: true,
      });
    }
    console.log("✅ Projects created");
  }

  // --- CERTIFICATES --------------------------------------------------------
  const certSeed = [
    {
      title: "Certificate Placeholder — Add Your Certificate",
      organization: "Issuing Organization",
    },
  ];
  
  const existingCertificates = await db.select().from(certificates);
  if (existingCertificates.length === 0) {
    for (let i = 0; i < certSeed.length; i++) {
      const c = certSeed[i];
      const slug = `placeholder-certificate-${i + 1}`;
      await db.insert(certificates).values({
        id: randomUUID(),
        slug,
        title: c.title,
        organization: c.organization,
        imageUrl: null,
        pdfUrl: null,
        date: new Date().toISOString().slice(0, 10),
        certificateId: null,
        verificationUrl: null,
        description:
          "This is placeholder content. Replace it with your real certificate from Admin → Certificates.",
        featured: false,
        order: i,
        published: false,
      });
    }
    console.log("✅ Certificates created");
  }

  // --- AWARDS -------------------------------------------------------------
  const existingAwards = await db.select().from(awards);
  if (existingAwards.length === 0) {
    await db.insert(awards).values({
      id: randomUUID(),
      title: "Award Placeholder — Add Your Award",
      description:
        "This is placeholder content. Replace it with a real award from Admin → Awards, or delete it.",
      date: null,
      icon: "award",
      organization: null,
      featured: false,
      order: 0,
      visible: false,
    });
    console.log("✅ Awards created");
  }

  // --- TESTIMONIALS --------------------------------------------------------
  const testimonialSeed = [
    { person: "Placeholder Reviewer", position: "Position", company: "Company" },
    { person: "Placeholder Reviewer", position: "Position", company: "Company" },
  ];
  
  const existingTestimonials = await db.select().from(testimonials);
  if (existingTestimonials.length === 0) {
    for (let i = 0; i < testimonialSeed.length; i++) {
      const t = testimonialSeed[i];
      await db.insert(testimonials).values({
        id: randomUUID(),
        person: t.person,
        position: t.position,
        company: t.company,
        photoUrl: null,
        quote:
          "This is placeholder testimonial text. Replace it with a real quote from Admin → Testimonials before publishing.",
        rating: 5,
        date: null,
        isPlaceholder: true,
        order: i,
        visible: false,
      });
    }
    console.log("✅ Testimonials created");
  }

  // --- GALLERY -------------------------------------------------------------
  const existingGallery = await db.select().from(galleryImages);
  if (existingGallery.length === 0) {
    await db.insert(galleryImages).values({
      id: randomUUID(),
      url: "/uploads/gallery/.gitkeep",
      caption: "Gallery placeholder — upload real photos from Admin → Gallery.",
      category: "Other",
      altText: "Placeholder gallery image",
      order: 0,
      visible: false,
    });
    console.log("✅ Gallery created");
  }

  // --- STATISTICS -------------------------------------------------------
  const statSeed = [
    { labelEn: "Projects", labelAr: "المشاريع", value: 6, suffix: "+", icon: "folder-code" },
    { labelEn: "Training Hours", labelAr: "ساعات التدريب", value: 120, suffix: "+", icon: "clock" },
    { labelEn: "Skills", labelAr: "المهارات", value: 25, suffix: "+", icon: "layers" },
    { labelEn: "Years Learning", labelAr: "سنوات التعلّم", value: 3, suffix: "+", icon: "graduation-cap" },
  ];
  
  const existingStats = await db.select().from(statistics);
  if (existingStats.length === 0) {
    for (let i = 0; i < statSeed.length; i++) {
      await db.insert(statistics).values({ id: randomUUID(), ...statSeed[i], order: i, visible: true });
    }
    console.log("✅ Statistics created");
  }

  console.log("✅ Seed completed!");
  console.log(`👤 Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    client.end();
  });