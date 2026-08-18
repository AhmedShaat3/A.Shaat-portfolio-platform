import { db, sqlite } from "./client";
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
import { nanoid } from "@/lib/utils/id";

async function seed() {
  console.log("Seeding database...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@portfolio.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  // --- USER -----------------------------------------------------------
  await db.insert(users).values({
    id: nanoid(),
    name: "Big Boss",
    email: adminEmail.toLowerCase(),
    passwordHash: await hashPassword(adminPassword),
    role: "admin",
  });

  // --- PROFILE ----------------------------------------------------------
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

  // --- SITE SETTINGS ------------------------------------------------------
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
    lastPublishedAt: new Date().toISOString(),
  });

  // --- CONTENT BLOCKS (editable copy) -----------------------------------
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
    await db.insert(contentBlocks).values([
      { id: nanoid(), section: c.section, key: c.key, locale: "en", value: c.en },
      { id: nanoid(), section: c.section, key: c.key, locale: "ar", value: c.ar },
    ]);
  }

  // --- NAVIGATION ---------------------------------------------------------
  const navSeed = [
    { labelEn: "About", labelAr: "نبذة عني", url: "#about" },
    { labelEn: "Skills", labelAr: "المهارات", url: "#skills" },
    { labelEn: "Experience", labelAr: "الخبرات", url: "#experience" },
    { labelEn: "Projects", labelAr: "المشاريع", url: "#projects" },
    { labelEn: "Certificates", labelAr: "الشهادات", url: "#certificates" },
    { labelEn: "Contact", labelAr: "تواصل", url: "#contact" },
  ];
  for (let i = 0; i < navSeed.length; i++) {
    await db.insert(navigationItems).values({
      id: nanoid(),
      ...navSeed[i],
      order: i,
    });
  }

  // --- SECTIONS (public page order) ---------------------------------------
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
  for (let i = 0; i < sectionSeed.length; i++) {
    await db.insert(sections).values({
      id: sectionSeed[i],
      labelEn: sectionSeed[i][0].toUpperCase() + sectionSeed[i].slice(1),
      order: i,
      visible: true,
    });
  }

  // --- SOCIAL LINKS ---------------------------------------------------------
  const socials = [
    { platform: "github", url: "https://github.com/", icon: "github" },
    { platform: "linkedin", url: "https://linkedin.com/", icon: "linkedin" },
    { platform: "email", url: "mailto:contact@example.com", icon: "email" },
  ];
  for (let i = 0; i < socials.length; i++) {
    await db.insert(socialLinks).values({ id: nanoid(), ...socials[i], order: i });
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
  for (let i = 0; i < skillSeed.length; i++) {
    await db.insert(skills).values({
      id: nanoid(),
      ...skillSeed[i],
      description: null,
      order: i,
    });
  }

  // --- EXPERIENCE -------------------------------------------------------
  await db.insert(experiences).values({
    id: nanoid(),
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
  });

  // --- EDUCATION ----------------------------------------------------------
  await db.insert(education).values({
    id: nanoid(),
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
  });

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

  for (let i = 0; i < projectSeed.length; i++) {
    const p = projectSeed[i];
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await db.insert(projects).values({
      id: nanoid(),
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

  // --- CERTIFICATES (placeholders — clearly marked) ------------------------
  const certSeed = [
    {
      title: "Certificate Placeholder — Add Your Certificate",
      organization: "Issuing Organization",
    },
  ];
  for (let i = 0; i < certSeed.length; i++) {
    const c = certSeed[i];
    const slug = `placeholder-certificate-${i + 1}`;
    await db.insert(certificates).values({
      id: nanoid(),
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
      published: false, // hidden by default until real content is added
    });
  }

  // --- AWARDS (empty placeholder) -----------------------------------------
  await db.insert(awards).values({
    id: nanoid(),
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

  // --- TESTIMONIALS (clearly marked placeholders) --------------------------
  const testimonialSeed = [
    { person: "Placeholder Reviewer", position: "Position", company: "Company" },
    { person: "Placeholder Reviewer", position: "Position", company: "Company" },
  ];
  for (let i = 0; i < testimonialSeed.length; i++) {
    const t = testimonialSeed[i];
    await db.insert(testimonials).values({
      id: nanoid(),
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
      visible: false, // hidden until replaced with real content
    });
  }

  // --- GALLERY (empty by default) ------------------------------------------
  await db.insert(galleryImages).values({
    id: nanoid(),
    url: "/uploads/gallery/.gitkeep",
    caption: "Gallery placeholder — upload real photos from Admin → Gallery.",
    category: "Other",
    altText: "Placeholder gallery image",
    order: 0,
    visible: false,
  });

  // --- STATISTICS -------------------------------------------------------
  const statSeed = [
    { labelEn: "Projects", labelAr: "المشاريع", value: 6, suffix: "+", icon: "folder-code" },
    { labelEn: "Training Hours", labelAr: "ساعات التدريب", value: 120, suffix: "+", icon: "clock" },
    { labelEn: "Skills", labelAr: "المهارات", value: 25, suffix: "+", icon: "layers" },
    { labelEn: "Years Learning", labelAr: "سنوات التعلّم", value: 3, suffix: "+", icon: "graduation-cap" },
  ];
  for (let i = 0; i < statSeed.length; i++) {
    await db.insert(statistics).values({ id: nanoid(), ...statSeed[i], order: i });
  }

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    sqlite.close();
  });
