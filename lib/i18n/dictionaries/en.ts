const en = {
  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    certificates: "Certificates",
    awards: "Awards",
    education: "Education",
    gallery: "Gallery",
    testimonials: "Testimonials",
    contact: "Contact",
    admin: "Admin",
  },
  hero: {
    downloadCv: "Download CV",
    contactMe: "Contact Me",
    scroll: "Scroll",
  },
  sections: {
    about: "About Me",
    skills: "Skills & Expertise",
    experience: "Experience",
    projects: "Featured Projects",
    projectsAll: "All Projects",
    certificates: "Certificates",
    awards: "Awards & Achievements",
    education: "Education",
    gallery: "Gallery",
    testimonials: "Testimonials",
    contact: "Get In Touch",
    stats: "By the Numbers",
  },
  projects: {
    viewProject: "View Project",
    liveDemo: "Live Demo",
    sourceCode: "Source Code",
    featured: "Featured",
    challenge: "The Challenge",
    solution: "The Solution",
    results: "The Results",
    technologies: "Technologies",
    status: {
      completed: "Completed",
      "in-progress": "In Progress",
      archived: "Archived",
    },
    searchPlaceholder: "Search projects...",
    allCategories: "All",
    noResults: "No projects match your search.",
    backToProjects: "Back to all projects",
  },
  certificates: {
    verify: "Verify",
    download: "Download PDF",
    preview: "Preview",
    issued: "Issued",
    credentialId: "Credential ID",
  },
  contact: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent — thank you! I'll get back to you soon.",
    error: "Something went wrong. Please try again.",
    location: "Location",
    phone: "Phone",
  },
  footer: {
    rights: "All rights reserved.",
    backToTop: "Back to top",
    builtWith: "Built with Next.js",
  },
  common: {
    loading: "Loading...",
    placeholder: "Placeholder content — update this from the admin dashboard.",
    demo: "Demo",
    readMore: "Read more",
  },
} as const;

export default en;

// A structural type (all leaves widened to `string`) so translated
// dictionaries (e.g. ar.ts) can supply different literal string values
// while still being required to match the same shape/keys as `en`.
type Widen<T> = T extends string
  ? string
  : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
