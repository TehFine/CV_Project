// ============================================================
// knowledge-base.ts — CV Analyzer Knowledge Base + Fallback Engine
// Supports: keyword scoring, experience detection, section parsing,
// skill synonym matching, and full local CV analysis when API is unavailable.
// ============================================================

// ─────────────────────────────────────────────
// 1. ROLE KNOWLEDGE BASE (keywords per role)
// ─────────────────────────────────────────────

export const ROLE_KNOWLEDGE_BASE: Record<string, string[]> = {
  frontend: [
    'react',
    'vue',
    'angular',
    'nextjs',
    'nuxtjs',
    'typescript',
    'javascript',
    'es6',
    'html',
    'html5',
    'css',
    'css3',
    'tailwind',
    'bootstrap',
    'sass',
    'scss',
    'less',
    'redux',
    'zustand',
    'context api',
    'recoil',
    'mobx',
    'webpack',
    'vite',
    'rollup',
    'parcel',
    'babel',
    'ui/ux',
    'responsive',
    'accessibility',
    'wcag',
    'storybook',
    'react query',
    'swr',
    'graphql client',
    'apollo client',
    'jest',
    'vitest',
    'testing library',
    'cypress',
    'playwright',
    'pwa',
    'web performance',
    'core web vitals',
    'seo',
  ],
  backend: [
    'nodejs',
    'node.js',
    'nest',
    'nestjs',
    'express',
    'fastify',
    'koa',
    'java',
    'spring boot',
    'spring',
    'maven',
    'gradle',
    'python',
    'django',
    'flask',
    'fastapi',
    'c#',
    '.net',
    'asp.net',
    'dotnet',
    'golang',
    'go',
    'gin',
    'fiber',
    'php',
    'laravel',
    'symfony',
    'ruby',
    'rails',
    'sql',
    'mysql',
    'postgresql',
    'postgres',
    'sqlite',
    'oracle',
    'mssql',
    'mongodb',
    'mongoose',
    'redis',
    'elasticsearch',
    'cassandra',
    'api',
    'rest',
    'restful',
    'graphql',
    'grpc',
    'websocket',
    'microservices',
    'message queue',
    'rabbitmq',
    'kafka',
    'docker',
    'orm',
    'prisma',
    'typeorm',
    'hibernate',
    'sequelize',
    'jwt',
    'oauth',
    'authentication',
    'authorization',
    'rbac',
    'caching',
    'rate limiting',
    'load balancing',
  ],
  mobile: [
    'flutter',
    'react native',
    'swift',
    'swiftui',
    'ios',
    'kotlin',
    'android',
    'dart',
    'objective-c',
    'jetpack compose',
    'xcode',
    'android studio',
    'mobile app',
    'mobile development',
    'firebase',
    'push notification',
    'app store',
    'google play',
    'sqlite',
    'realm',
    'hive',
    'local storage',
    'retrofit',
    'dio',
    'alamofire',
    'bloc',
    'provider',
    'riverpod',
    'getx',
    'redux',
    'biometric',
    'camera',
    'gps',
    'geolocation',
  ],
  devops: [
    'docker',
    'docker compose',
    'kubernetes',
    'k8s',
    'helm',
    'jenkins',
    'gitlab ci',
    'github actions',
    'circleci',
    'travis',
    'ci/cd',
    'pipeline',
    'devops',
    'sre',
    'platform engineering',
    'terraform',
    'ansible',
    'puppet',
    'chef',
    'pulumi',
    'aws',
    'ec2',
    's3',
    'lambda',
    'ecs',
    'eks',
    'rds',
    'cloudfront',
    'azure',
    'gcp',
    'google cloud',
    'linux',
    'ubuntu',
    'centos',
    'bash',
    'shell scripting',
    'nginx',
    'apache',
    'haproxy',
    'prometheus',
    'grafana',
    'elk',
    'datadog',
    'splunk',
    'newrelic',
    'networking',
    'vpc',
    'dns',
    'ssl',
    'cdn',
    'security',
    'iam',
    'vault',
    'sops',
  ],
  data: [
    'python',
    'r',
    'sql',
    'machine learning',
    'ml',
    'deep learning',
    'dl',
    'neural network',
    'data analysis',
    'data analytics',
    'data science',
    'data engineering',
    'data visualization',
    'bi',
    'business intelligence',
    'pandas',
    'numpy',
    'scipy',
    'matplotlib',
    'seaborn',
    'plotly',
    'scikit-learn',
    'sklearn',
    'tensorflow',
    'keras',
    'pytorch',
    'spark',
    'pyspark',
    'hadoop',
    'hive',
    'airflow',
    'dbt',
    'tableau',
    'power bi',
    'looker',
    'metabase',
    'big data',
    'data warehouse',
    'data lake',
    'etl',
    'elt',
    'statistics',
    'regression',
    'classification',
    'clustering',
    'nlp',
    'computer vision',
    'transformers',
    'llm',
    'rag',
    'feature engineering',
    'model deployment',
    'mlops',
  ],
  tester: [
    'automation test',
    'manual test',
    'automation testing',
    'manual testing',
    'selenium',
    'cypress',
    'playwright',
    'puppeteer',
    'jest',
    'mocha',
    'jasmine',
    'junit',
    'testng',
    'unit test',
    'integration test',
    'e2e test',
    'regression test',
    'test case',
    'test plan',
    'test strategy',
    'test report',
    'bug report',
    'defect management',
    'tdd',
    'bdd',
    'jira',
    'testlink',
    'testrail',
    'xray',
    'postman',
    'api testing',
    'rest assured',
    'karate',
    'performance testing',
    'jmeter',
    'locust',
    'k6',
    'security testing',
    'penetration testing',
    'qa',
    'qc',
    'quality assurance',
    'quality control',
  ],
  design: [
    'figma',
    'adobe xd',
    'sketch',
    'invision',
    'framer',
    'photoshop',
    'illustrator',
    'indesign',
    'after effects',
    'ui/ux',
    'ux design',
    'ui design',
    'product design',
    'design thinking',
    'design system',
    'atomic design',
    'wireframe',
    'prototype',
    'mockup',
    'user flow',
    'user research',
    'usability testing',
    'a/b testing',
    'graphic design',
    'visual design',
    'branding',
    'identity',
    'layout',
    'typography',
    'color theory',
    'grid system',
    'motion design',
    'animation',
    'lottie',
    'principle',
  ],
  management: [
    'project management',
    'product management',
    'program management',
    'agile',
    'scrum',
    'kanban',
    'lean',
    'safe',
    'scaled agile',
    'sprint',
    'retrospective',
    'backlog',
    'roadmap',
    'requirement',
    'srs',
    'brd',
    'user story',
    'use case',
    'product owner',
    'scrum master',
    'tech lead',
    'team lead',
    'stakeholder',
    'stakeholder management',
    'communication',
    'jira',
    'trello',
    'asana',
    'notion',
    'confluence',
    'risk management',
    'budget',
    'planning',
    'estimation',
    'ba',
    'business analyst',
    'system analyst',
    'business analysis',
  ],
  marketing: [
    'seo',
    'sem',
    'seo/sem',
    'content marketing',
    'content strategy',
    'social media',
    'social media marketing',
    'smm',
    'google ads',
    'facebook ads',
    'meta ads',
    'tiktok ads',
    'email marketing',
    'marketing automation',
    'hubspot',
    'mailchimp',
    'analytics',
    'google analytics',
    'ga4',
    'mixpanel',
    'marketing strategy',
    'branding',
    'brand identity',
    'copywriting',
    'content writing',
    'blog',
    'landing page',
    'conversion rate',
    'cro',
    'growth hacking',
    'funnel',
    'affiliate marketing',
    'influencer marketing',
    'kol',
  ],
  soft_skills: [
    'teamwork',
    'team player',
    'collaboration',
    'communication',
    'presentation',
    'public speaking',
    'problem solving',
    'critical thinking',
    'analytical thinking',
    'time management',
    'self management',
    'prioritization',
    'leadership',
    'mentoring',
    'coaching',
    'adaptability',
    'flexibility',
    'continuous learning',
    'creativity',
    'innovation',
    'english',
    'tiếng anh',
    'ielts',
    'toeic',
    'toefl',
    'japanese',
    'tiếng nhật',
    'jlpt',
    'chinese',
    'tiếng trung',
  ],
};

// ─────────────────────────────────────────────
// 2. ROLE MAPPING
// ─────────────────────────────────────────────

export const ROLE_MAPPING: Record<string, string | string[]> = {
  frontend: 'frontend',
  'front-end': 'frontend',
  'front end': 'frontend',
  web: 'frontend',
  'web developer': 'frontend',
  backend: 'backend',
  'back-end': 'backend',
  'back end': 'backend',
  server: 'backend',
  node: 'backend',
  java: 'backend',
  python: 'backend',
  fullstack: ['frontend', 'backend'],
  'full-stack': ['frontend', 'backend'],
  'full stack': ['frontend', 'backend'],
  mobile: 'mobile',
  android: 'mobile',
  ios: 'mobile',
  flutter: 'mobile',
  'react native': 'mobile',
  devops: 'devops',
  cloud: 'devops',
  aws: 'devops',
  infrastructure: 'devops',
  sre: 'devops',
  platform: 'devops',
  data: 'data',
  ai: 'data',
  'machine learning': 'data',
  'data scientist': 'data',
  'data analyst': 'data',
  'data engineer': 'data',
  tester: 'tester',
  qa: 'tester',
  qc: 'tester',
  'quality assurance': 'tester',
  'kiểm thử': 'tester',
  automation: 'tester',
  design: 'design',
  ui: 'design',
  ux: 'design',
  designer: 'design',
  'ui/ux': 'design',
  graphic: 'design',
  manager: 'management',
  pm: 'management',
  ba: 'management',
  analyst: 'management',
  'scrum master': 'management',
  'product owner': 'management',
  'tech lead': 'management',
  'team lead': 'management',
  marketing: 'marketing',
  seo: 'marketing',
  sale: 'marketing',
  sales: 'marketing',
  growth: 'marketing',
};

// ─────────────────────────────────────────────
// 3. SKILL WEIGHTS (importance per role)
//    3 = core, 2 = important, 1 = bonus
// ─────────────────────────────────────────────

export const SKILL_WEIGHTS: Record<string, Record<string, number>> = {
  frontend: {
    react: 3,
    vue: 3,
    angular: 3,
    nextjs: 3,
    typescript: 3,
    javascript: 3,
    html: 2,
    css: 2,
    tailwind: 2,
    responsive: 2,
    redux: 2,
    webpack: 1,
    vite: 1,
    'testing library': 2,
    jest: 2,
  },
  backend: {
    nodejs: 3,
    java: 3,
    python: 3,
    golang: 3,
    'c#': 3,
    'spring boot': 3,
    nestjs: 3,
    express: 2,
    postgresql: 3,
    mysql: 3,
    mongodb: 3,
    redis: 2,
    docker: 2,
    microservices: 3,
    restful: 3,
    graphql: 2,
    jwt: 2,
    kafka: 2,
  },
  mobile: {
    flutter: 3,
    'react native': 3,
    swift: 3,
    kotlin: 3,
    dart: 2,
    ios: 2,
    android: 2,
    firebase: 2,
    bloc: 2,
    provider: 2,
  },
  devops: {
    docker: 3,
    kubernetes: 3,
    aws: 3,
    terraform: 3,
    'ci/cd': 3,
    'github actions': 2,
    jenkins: 2,
    linux: 3,
    bash: 2,
    nginx: 2,
    prometheus: 2,
    grafana: 2,
  },
  data: {
    python: 3,
    sql: 3,
    'machine learning': 3,
    pandas: 3,
    numpy: 2,
    'scikit-learn': 3,
    tensorflow: 2,
    pytorch: 2,
    spark: 2,
    tableau: 2,
    'power bi': 2,
  },
  tester: {
    selenium: 3,
    cypress: 3,
    playwright: 3,
    jest: 2,
    junit: 2,
    'api testing': 3,
    postman: 2,
    jira: 2,
    'test case': 3,
    'automation testing': 3,
  },
  design: {
    figma: 3,
    'adobe xd': 3,
    'ui/ux': 3,
    'design thinking': 2,
    'design system': 2,
    wireframe: 2,
    prototype: 2,
    'user research': 2,
  },
  management: {
    agile: 3,
    scrum: 3,
    jira: 2,
    'product owner': 3,
    backlog: 2,
    'user story': 3,
    requirement: 3,
    stakeholder: 2,
    roadmap: 2,
  },
  marketing: {
    seo: 3,
    'google ads': 3,
    'facebook ads': 2,
    'google analytics': 2,
    'content marketing': 2,
    'email marketing': 2,
    'marketing strategy': 3,
  },
};

// ─────────────────────────────────────────────
// 4. EXPERIENCE LEVEL PATTERNS
// ─────────────────────────────────────────────

export const EXPERIENCE_PATTERNS = {
  senior: [
    /\b(senior|sr\.?|lead|principal|staff|architect|head of|vp of|director)\b/i,
    /\b(7\+?\s*năm|8\+?\s*năm|9\+?\s*năm|10\+?\s*năm)\b/i,
    /\b([7-9]|1[0-9])\+?\s*(years?|yrs?|năm)\s*(of\s*)?(experience|exp)\b/i,
    /\b(mentored|managed team|led team|architected|designed system|scaled)\b/i,
  ],
  mid: [
    /\b(mid[\s-]?level|intermediate|experienced)\b/i,
    /\b([3-6]\+?\s*(years?|yrs?|năm)\s*(of\s*)?(experience|exp))\b/i,
    /\b(3\+?\s*năm|4\+?\s*năm|5\+?\s*năm|6\+?\s*năm)\b/i,
    /\b(independently|owned|delivered|improved|optimized|refactored)\b/i,
  ],
  junior: [
    /\b(junior|jr\.?|fresher|fresh graduate|entry[\s-]?level|intern|thực tập)\b/i,
    /\b([0-2]\+?\s*(years?|yrs?|năm)\s*(of\s*)?(experience|exp))\b/i,
    /\b(0-1\s*năm|1\s*năm|2\s*năm)\b/i,
    /\b(learning|studying|bootcamp|course|self[\s-]?taught)\b/i,
  ],
};

// ─────────────────────────────────────────────
// 5. CV SECTION PATTERNS
// ─────────────────────────────────────────────

export const CV_SECTION_PATTERNS = {
  summary: [
    /\b(summary|objective|profile|about me|career objective|professional summary|giới thiệu|mục tiêu nghề nghiệp|tóm tắt)\b/i,
  ],
  education: [
    /\b(education|academic|university|college|degree|bachelor|master|phd|học vấn|trình độ học vấn|đại học|cao đẳng|bằng cấp)\b/i,
  ],
  experience: [
    /\b(experience|work experience|employment|career|work history|professional experience|kinh nghiệm|kinh nghiệm làm việc|quá trình công tác)\b/i,
  ],
  skills: [
    /\b(skills|technical skills|competencies|expertise|technologies|kỹ năng|công nghệ|kỹ năng chuyên môn)\b/i,
  ],
  projects: [
    /\b(projects|personal projects|side projects|portfolio|dự án|dự án cá nhân)\b/i,
  ],
  certifications: [
    /\b(certifications?|certificates?|licenses?|credentials|chứng chỉ|bằng cấp|chứng nhận)\b/i,
  ],
  awards: [
    /\b(awards?|honors?|achievements?|recognition|giải thưởng|thành tích|khen thưởng)\b/i,
  ],
  languages: [/\b(languages?|linguistic|ngoại ngữ|ngôn ngữ)\b/i],
};

// ─────────────────────────────────────────────
// 6. POSITIVE IMPACT PHRASES (boost score)
// ─────────────────────────────────────────────

export const POSITIVE_IMPACT_PHRASES = [
  // Quantified achievements
  /\b(reduced|improved|increased|decreased|optimized|cut|boosted)\b.{0,40}\b(\d+%|\d+x|by \d+)\b/i,
  /\b(\d+%|\d+x)\b.{0,30}\b(faster|improvement|reduction|increase|better|performance)\b/i,
  // Scale
  /\b(million|1m\+|10k\+|100k\+|scaled to|handles? \d+)\b/i,
  /\b(high traffic|high performance|high availability|99\.?\d*%)\b/i,
  // Leadership
  /\b(led a team|managed \d+|mentored \d+|architected|designed from scratch)\b/i,
  // Awards / recognition
  /\b(award|prize|recognition|first place|top \d|winner|best project)\b/i,
];

// ─────────────────────────────────────────────
// 7. RED FLAG PATTERNS (reduce score)
// ─────────────────────────────────────────────

export const RED_FLAG_PATTERNS = [
  /\b(responsible for|assisted in|helped with|worked on)\b/i, // vague verbs
  /\b(etc\.?|and more|various|several|some)\b/i, // vague quantifiers
];

// ─────────────────────────────────────────────
// 8. EDUCATION TIER SCORING
// ─────────────────────────────────────────────

export const EDUCATION_TIERS: {
  pattern: RegExp;
  score: number;
  label: string;
}[] = [
  {
    pattern: /\b(phd|doctorate|tiến sĩ|ph\.d)\b/i,
    score: 10,
    label: 'Tiến sĩ (PhD)',
  },
  {
    pattern: /\b(master|thạc sĩ|mba|m\.sc|m\.eng)\b/i,
    score: 8,
    label: 'Thạc sĩ',
  },
  {
    pattern: /\b(bachelor|cử nhân|kỹ sư|b\.sc|b\.eng|đại học)\b/i,
    score: 6,
    label: 'Đại học',
  },
  {
    pattern: /\b(associate|cao đẳng|college)\b/i,
    score: 4,
    label: 'Cao đẳng',
  },
  {
    pattern: /\b(bootcamp|certificate program|chứng chỉ khóa học)\b/i,
    score: 3,
    label: 'Bootcamp / Khóa học',
  },
];

// ─────────────────────────────────────────────
// 9. CERTIFICATION VALUE MAP
// ─────────────────────────────────────────────

export const CERTIFICATION_VALUES: {
  pattern: RegExp;
  score: number;
  label: string;
}[] = [
  {
    pattern:
      /\b(aws certified|aws solutions architect|aws developer|aws sysops)\b/i,
    score: 5,
    label: 'AWS Certification',
  },
  {
    pattern:
      /\b(google cloud|gcp certified|associate cloud engineer|professional cloud)\b/i,
    score: 5,
    label: 'GCP Certification',
  },
  {
    pattern: /\b(azure certified|microsoft certified|az-\d+)\b/i,
    score: 5,
    label: 'Azure Certification',
  },
  {
    pattern: /\b(ckad|cka|cks|kubernetes certified)\b/i,
    score: 5,
    label: 'Kubernetes Certification',
  },
  {
    pattern: /\b(pmp|project management professional)\b/i,
    score: 4,
    label: 'PMP',
  },
  {
    pattern: /\b(csm|certified scrum master)\b/i,
    score: 3,
    label: 'Scrum Master',
  },
  {
    pattern: /\b(ielts [6-9]|ielts [6-9]\.[0-9])\b/i,
    score: 3,
    label: 'IELTS 6.0+',
  },
  {
    pattern: /\b(toeic [7-9]\d{2}|toeic [89]\d{2})\b/i,
    score: 3,
    label: 'TOEIC 700+',
  },
  {
    pattern: /\b(oracle certified|ocp|oca)\b/i,
    score: 3,
    label: 'Oracle Certification',
  },
  {
    pattern: /\b(google analytics|meta certified|hubspot certified)\b/i,
    score: 2,
    label: 'Marketing Certification',
  },
];

// ─────────────────────────────────────────────
// 10. SCORING CONFIG
// ─────────────────────────────────────────────

export const SCORING_CONFIG = {
  maxScore: 100,
  weights: {
    skills: 45, // keyword matches weighted by role
    experience: 25, // years + impact + seniority
    education: 10, // degree tier
    certifications: 10, // industry certs
    softSkills: 5, // teamwork, communication, etc.
    presentation: 5, // structure, sections, completeness
  },
  bonuses: {
    quantifiedImpact: 3, // per quantified achievement found
    openSource: 2, // github / open source mentions
    awardMention: 2, // awards or recognitions
    multiLanguage: 1, // multiple human languages
  },
  penalties: {
    vagueLanguage: -1, // per vague phrase found (max -5)
    missingSection: -2, // per critical missing section
    noContact: -3, // no email / phone
  },
};

// ─────────────────────────────────────────────
// 11. TYPE DEFINITIONS
// ─────────────────────────────────────────────

export interface CVAnalysisResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  detectedRoles: string[];
  experienceLevel: 'senior' | 'mid' | 'junior' | 'unknown';
  breakdown: {
    skills: {
      score: number;
      maxScore: number;
      matchedKeywords: string[];
      missingKeywords: string[];
    };
    experience: { score: number; maxScore: number; details: string[] };
    education: { score: number; maxScore: number; detected: string };
    certifications: { score: number; maxScore: number; found: string[] };
    softSkills: { score: number; maxScore: number; matchedKeywords: string[] };
    presentation: {
      score: number;
      maxScore: number;
      sectionsFound: string[];
      sectionsMissing: string[];
    };
  };
  strengths: string[];
  improvements: string[];
  summary: string;
  analysisSource: 'gemini_api' | 'local_fallback';
}

// ─────────────────────────────────────────────
// 12. HELPER UTILITIES
// ─────────────────────────────────────────────

/**
 * Normalize text: lowercase, remove punctuation noise
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, "'") // normalize quotes
    .replace(/[–—]/g, '-') // normalize dashes
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

/**
 * Aggressive normalization for keyword matching:
 * removes dots, dashes, underscores, spaces so that
 * "node.js", "Node JS", "nodejs", "node-js" all match each other.
 */
export function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-._\s]+/g, '') // strip dots, dashes, underscores, whitespace
    .trim();
}

/**
 * Detect which role(s) a CV is targeting
 */
export function detectRoles(cvText: string): string[] {
  const normalized = normalizeText(cvText);
  const found = new Set<string>();

  for (const [key, value] of Object.entries(ROLE_MAPPING)) {
    if (normalized.includes(key.toLowerCase())) {
      if (Array.isArray(value)) value.forEach((v) => found.add(v));
      else found.add(value);
    }
  }

  // If no role detected from mapping, use keyword frequency
  if (found.size === 0) {
    const scores: Record<string, number> = {};
    for (const [role, keywords] of Object.entries(ROLE_KNOWLEDGE_BASE)) {
      scores[role] = keywords.filter((kw) => normalized.includes(kw)).length;
    }
    const topRole = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (topRole && topRole[1] > 0) found.add(topRole[0]);
  }

  return Array.from(found);
}

/**
 * Detect experience level
 */
export function detectExperienceLevel(
  cvText: string,
): 'senior' | 'mid' | 'junior' | 'unknown' {
  const normalized = normalizeText(cvText);
  for (const [level, patterns] of Object.entries(EXPERIENCE_PATTERNS)) {
    if (patterns.some((p) => p.test(normalized))) {
      return level as 'senior' | 'mid' | 'junior';
    }
  }
  return 'unknown';
}

/**
 * Detect which sections exist in CV
 */
export function detectSections(cvText: string): {
  found: string[];
  missing: string[];
} {
  const normalized = normalizeText(cvText);
  const criticalSections = ['experience', 'skills', 'education'];
  const allSections = Object.keys(CV_SECTION_PATTERNS);

  const found = allSections.filter((section) =>
    CV_SECTION_PATTERNS[section as keyof typeof CV_SECTION_PATTERNS].some((p) =>
      p.test(normalized),
    ),
  );

  const missing = criticalSections.filter((s) => !found.includes(s));
  return { found, missing };
}

/**
 * Score skill matches for given roles
 *
 * Uses an exponential scoring curve instead of linear ratio:
 * The first matches are rewarded heavily (like Gemini's semantic understanding),
 * and additional matches give diminishing returns.
 *
 * Also uses fuzzy matching so "node.js", "NodeJS", "node js" all count the same.
 */
function scoreSkills(
  cvText: string,
  roles: string[],
): CVAnalysisResult['breakdown']['skills'] {
  const normalized = normalizeText(cvText);
  const fuzzyNormalized = normalizeForMatching(cvText);
  const matched = new Set<string>();
  const missing: string[] = [];
  let rawScore = 0;
  let coreMaxRaw = 0; // ← denominator: only weight >= 2 keywords

  for (const role of roles) {
    const keywords = ROLE_KNOWLEDGE_BASE[role] || [];
    const weights = SKILL_WEIGHTS[role] || {};

    for (const kw of keywords) {
      const weight = weights[kw] ?? 1;
      const normalizedKw = normalizeForMatching(kw);

      // Only count weight >= 2 keywords in the denominator.
      // Weight=1 keywords are treated as bonus (they add to rawScore but not the cap).
      if (weight >= 2) coreMaxRaw += weight;

      // Fuzzy match: try exact first, then normalized (fuzzy) for multi-char keywords
      const exactMatch = normalized.includes(kw.toLowerCase());
      const fuzzyMatch =
        !exactMatch &&
        normalizedKw.length >= 4 &&
        fuzzyNormalized.includes(normalizedKw);

      if (exactMatch || fuzzyMatch) {
        rawScore += weight;
        matched.add(kw);
      } else if (weight === 3) {
        missing.push(kw);
      }
    }
  }

  // Use exponential scoring curve with coreMaxRaw (weight>=2 keywords only)
  // as the denominator. This means we compare against only the ~15 most
  // important keywords per role, not all 50+.
  //
  // Lambda = 6 gives a steeper curve:
  // At 10% core ratio → 45% of max → ~20/45
  // At 20% core ratio → 70% of max → ~31/45
  // At 30% core ratio → 83% of max → ~38/45
  // At 40% core ratio → 91% of max → ~41/45
  // At 50% core ratio → 95% of max → ~43/45
  let score = 0;
  if (coreMaxRaw > 0) {
    const matchRatio = Math.min(rawScore / coreMaxRaw, 1.0);
    const effectiveRatio = 1 - Math.exp(-6 * matchRatio);
    score = Math.round(effectiveRatio * SCORING_CONFIG.weights.skills);
  }

  return {
    score: Math.min(score, SCORING_CONFIG.weights.skills),
    maxScore: SCORING_CONFIG.weights.skills,
    matchedKeywords: Array.from(matched),
    missingKeywords: missing.slice(0, 10),
  };
}

/**
 * Score experience section
 */
function scoreExperience(
  cvText: string,
  level: 'senior' | 'mid' | 'junior' | 'unknown',
): CVAnalysisResult['breakdown']['experience'] {
  const normalized = normalizeText(cvText);
  const details: string[] = [];
  let score = 0;

  // Base by seniority — increased to better match Gemini scoring
  const baseByLevel = { senior: 20, mid: 16, junior: 12, unknown: 10 };
  score += baseByLevel[level];
  details.push(`Cấp độ phát hiện: ${level}`);

  // Bonus for impact phrases
  let impactCount = 0;
  for (const pattern of POSITIVE_IMPACT_PHRASES) {
    if (pattern.test(normalized)) {
      impactCount++;
      score += SCORING_CONFIG.bonuses.quantifiedImpact;
      if (impactCount <= 2) details.push('Tìm thấy thành tích định lượng');
    }
  }

  // Small penalty for vague language
  let vagueCount = 0;
  for (const pattern of RED_FLAG_PATTERNS) {
    const matches = normalized.match(new RegExp(pattern.source, 'gi'));
    if (matches) vagueCount += matches.length;
  }
  if (vagueCount > 3) {
    score -= 2;
    details.push('Ngôn ngữ mô tả còn chung chung');
  }

  // Bonus: open source / github
  if (/\b(github|gitlab|open[\s-]?source|contributed to)\b/i.test(normalized)) {
    score += SCORING_CONFIG.bonuses.openSource;
    details.push('Có đóng góp mã nguồn mở / GitHub');
  }

  return {
    score: Math.min(Math.max(score, 0), SCORING_CONFIG.weights.experience),
    maxScore: SCORING_CONFIG.weights.experience,
    details,
  };
}

/**
 * Score education
 */
function scoreEducation(
  cvText: string,
): CVAnalysisResult['breakdown']['education'] {
  const normalized = normalizeText(cvText);
  let detected = 'Không phát hiện';
  let eduScore = 0;

  for (const tier of EDUCATION_TIERS) {
    if (tier.pattern.test(normalized)) {
      eduScore = tier.score;
      detected = tier.label;
      break;
    }
  }

  const score = Math.round((eduScore / 10) * SCORING_CONFIG.weights.education);
  return {
    score: Math.min(score, SCORING_CONFIG.weights.education),
    maxScore: SCORING_CONFIG.weights.education,
    detected,
  };
}

/**
 * Score certifications
 */
function scoreCertifications(
  cvText: string,
): CVAnalysisResult['breakdown']['certifications'] {
  const normalized = normalizeText(cvText);
  const found: string[] = [];
  let raw = 0;

  for (const cert of CERTIFICATION_VALUES) {
    if (cert.pattern.test(normalized)) {
      found.push(cert.label);
      raw += cert.score;
    }
  }

  const score = Math.min(
    Math.round((raw / 10) * SCORING_CONFIG.weights.certifications),
    SCORING_CONFIG.weights.certifications,
  );

  return { score, maxScore: SCORING_CONFIG.weights.certifications, found };
}

/**
 * Score soft skills
 * Uses fuzzy matching and exponential curve for consistency.
 */
function scoreSoftSkills(
  cvText: string,
): CVAnalysisResult['breakdown']['softSkills'] {
  const normalized = normalizeText(cvText);
  const fuzzyNormalized = normalizeForMatching(cvText);
  const matched = ROLE_KNOWLEDGE_BASE.soft_skills.filter((kw) => {
    const normalizedKw = normalizeForMatching(kw);
    if (normalizedKw.length === 0) return false;
    // Try exact match first
    if (normalized.includes(kw.toLowerCase())) return true;
    // Then fuzzy match (only for multi-char keywords to avoid false positives)
    if (normalizedKw.length >= 4 && fuzzyNormalized.includes(normalizedKw))
      return true;
    return false;
  });

  const ratio =
    ROLE_KNOWLEDGE_BASE.soft_skills.length > 0
      ? matched.length / ROLE_KNOWLEDGE_BASE.soft_skills.length
      : 0;
  // Steeper curve (λ=6) so matching a few soft skills gives decent score
  const effectiveRatio = 1 - Math.exp(-6 * ratio);
  const score = Math.min(
    Math.round(effectiveRatio * SCORING_CONFIG.weights.softSkills),
    SCORING_CONFIG.weights.softSkills,
  );

  return {
    score,
    maxScore: SCORING_CONFIG.weights.softSkills,
    matchedKeywords: matched,
  };
}

/**
 * Score presentation / structure
 */
function scorePresentation(
  cvText: string,
  sections: { found: string[]; missing: string[] },
): CVAnalysisResult['breakdown']['presentation'] {
  let score = SCORING_CONFIG.weights.presentation;

  // Penalize missing critical sections
  score += sections.missing.length * SCORING_CONFIG.penalties.missingSection;

  // Penalize no contact info
  const hasContact =
    /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/i.test(cvText) ||
    /\b(\+84|0[3-9]\d{8}|\(\d{3}\)\s?\d{3}-\d{4})\b/.test(cvText);
  if (!hasContact) score += SCORING_CONFIG.penalties.noContact;

  return {
    score: Math.max(score, 0),
    maxScore: SCORING_CONFIG.weights.presentation,
    sectionsFound: sections.found,
    sectionsMissing: sections.missing,
  };
}

/**
 * Map numeric score to letter grade
 */
function scoreToGrade(score: number): CVAnalysisResult['grade'] {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  if (score >= 40) return 'C';
  return 'D';
}

/**
 * Generate human-readable strengths and improvement tips
 */
function generateFeedback(
  breakdown: CVAnalysisResult['breakdown'],
  roles: string[],
  level: string,
): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Skills feedback
  const skillRatio = breakdown.skills.score / breakdown.skills.maxScore;
  if (skillRatio >= 0.75) {
    strengths.push(
      `Kỹ năng kỹ thuật phù hợp tốt với vị trí ${roles.join('/')} (${breakdown.skills.matchedKeywords.length} kỹ năng nhận diện được)`,
    );
  } else if (skillRatio < 0.4) {
    improvements.push(
      `Bổ sung thêm kỹ năng quan trọng: ${breakdown.skills.missingKeywords.slice(0, 5).join(', ')}`,
    );
  }

  // Experience feedback
  if (breakdown.experience.details.some((d) => d.includes('định lượng'))) {
    strengths.push(
      'CV có các thành tích định lượng cụ thể (con số, phần trăm), tạo ấn tượng mạnh',
    );
  } else {
    improvements.push(
      'Thêm các thành tích cụ thể với con số đo lường (ví dụ: "Tối ưu tốc độ tải trang 40%", "Xử lý 10.000 request/giây")',
    );
  }

  // Education
  if (breakdown.education.score >= 6) {
    strengths.push(`Nền tảng học vấn tốt: ${breakdown.education.detected}`);
  }

  // Certs
  if (breakdown.certifications.found.length > 0) {
    strengths.push(
      `Có chứng chỉ chuyên ngành: ${breakdown.certifications.found.join(', ')}`,
    );
  } else {
    improvements.push(
      'Thêm chứng chỉ quốc tế liên quan (AWS, GCP, Azure, PMP...) để tăng uy tín',
    );
  }

  // Soft skills
  if (breakdown.softSkills.score >= 3) {
    strengths.push('Kỹ năng mềm được thể hiện rõ ràng trong CV');
  } else {
    improvements.push(
      'Đề cập rõ hơn về kỹ năng mềm: giao tiếp, làm việc nhóm, quản lý thời gian',
    );
  }

  // Sections
  if (breakdown.presentation.sectionsMissing.length > 0) {
    improvements.push(
      `Bổ sung các phần còn thiếu: ${breakdown.presentation.sectionsMissing.join(', ')}`,
    );
  }

  return { strengths, improvements };
}

// ─────────────────────────────────────────────
// 13. MAIN FALLBACK ANALYZER
// ─────────────────────────────────────────────

/**
 * Kiểm tra nội dung có phải là CV hợp lệ hay không dựa trên:
 * - Có ít nhất 2/3 section quan trọng (Experience, Skills, Education)
 * - Có thông tin liên hệ (email hoặc số điện thoại)
 * - Có độ dài tối thiểu
 */
export function isValidCV(cvText: string): { valid: boolean; reason: string } {
  const normalized = normalizeText(cvText);

  // Kiểm tra độ dài tối thiểu (tránh file rỗng hoặc quá ngắn)
  if (normalized.length < 50) {
    return {
      valid: false,
      reason: 'Tài liệu quá ngắn, không đủ thông tin để phân tích CV.',
    };
  }

  // Phát hiện các section
  const sections = detectSections(normalized);
  const criticalSections = ['experience', 'skills', 'education'];
  const foundCritical = criticalSections.filter((s) =>
    sections.found.includes(s),
  );

  if (foundCritical.length < 2) {
    const foundList =
      foundCritical.length === 0
        ? 'không tìm thấy phần nào'
        : `chỉ tìm thấy: ${foundCritical.join(', ')}`;
    return {
      valid: false,
      reason: `Tài liệu không giống một bản CV hợp lệ (${foundList}). Một CV cần có ít nhất 2 trong 3 phần: Kinh nghiệm (Experience), Kỹ năng (Skills), Học vấn (Education).`,
    };
  }

  // Kiểm tra thông tin liên hệ
  const hasContact =
    /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(normalized) ||
    /(\+84|0[3-9]\d{8}|\(\d{3}\)\s?\d{3}-\d{4})/.test(normalized);
  if (!hasContact) {
    return {
      valid: false,
      reason:
        'Tài liệu không giống một bản CV hợp lệ (không tìm thấy email hoặc số điện thoại). Vui lòng kiểm tra lại.',
    };
  }

  return { valid: true, reason: '' };
}

/**
 * Analyze a CV using local knowledge base only (no API required).
 * Use this as fallback when Gemini API is unavailable or quota exceeded.
 *
 * @param cvText - Raw extracted text of the CV
 * @param targetRole - Optional override for target role (e.g. "frontend")
 */
export function analyzeCVLocal(
  cvText: string,
  targetRole?: string,
): CVAnalysisResult {
  const normalized = normalizeText(cvText);

  // Validate that this looks like a CV before analyzing
  const cvCheck = isValidCV(normalized);
  if (!cvCheck.valid) {
    throw new Error(cvCheck.reason);
  }

  // Step 1: Determine roles
  let detectedRoles = targetRole
    ? (() => {
        const mappedRole = ROLE_MAPPING[targetRole.toLowerCase()];
        if (!mappedRole) {
          // targetRole is not a valid KB role key (e.g. "Vị trí ứng tuyển chung")
          // fall back to auto-detection from CV content
          return detectRoles(cvText);
        }
        return Array.isArray(mappedRole) ? mappedRole : [mappedRole];
      })()
    : detectRoles(cvText);

  if (detectedRoles.length === 0) detectedRoles = ['backend'];

  // Validate that all detected roles actually exist in the knowledge base.
  // If the role string doesn't match any KB entry, filter it out and retry detection.
  const validRoles = detectedRoles.filter(
    (r) => ROLE_KNOWLEDGE_BASE[r] !== undefined,
  );
  if (validRoles.length === 0) {
    // No valid roles found — retry with auto-detection
    const autoDetected = detectRoles(cvText);
    detectedRoles = autoDetected.length > 0 ? autoDetected : ['backend'];
  } else {
    detectedRoles = validRoles;
  } // safe default

  // Step 2: Detect level
  const experienceLevel = detectExperienceLevel(cvText);

  // Step 3: Detect sections
  const sections = detectSections(cvText);

  // Step 4: Sub-scores
  const skillsBreakdown = scoreSkills(normalized, detectedRoles);
  const experienceBreakdown = scoreExperience(normalized, experienceLevel);
  const educationBreakdown = scoreEducation(normalized);
  const certBreakdown = scoreCertifications(normalized);
  const softSkillsBreakdown = scoreSoftSkills(normalized);
  const presentationBreakdown = scorePresentation(cvText, sections);

  const breakdown: CVAnalysisResult['breakdown'] = {
    skills: skillsBreakdown,
    experience: experienceBreakdown,
    education: educationBreakdown,
    certifications: certBreakdown,
    softSkills: softSkillsBreakdown,
    presentation: presentationBreakdown,
  };

  // Step 5: Total score
  const rawTotal =
    skillsBreakdown.score +
    experienceBreakdown.score +
    educationBreakdown.score +
    certBreakdown.score +
    softSkillsBreakdown.score +
    presentationBreakdown.score;

  const overallScore = Math.min(Math.max(Math.round(rawTotal), 0), 100);
  const grade = scoreToGrade(overallScore);

  // Step 6: Feedback
  const { strengths, improvements } = generateFeedback(
    breakdown,
    detectedRoles,
    experienceLevel,
  );

  // Step 7: Summary
  const summary =
    `CV được phân tích bởi hệ thống nội bộ (fallback). ` +
    `Phát hiện vị trí: ${detectedRoles.join(', ')} | ` +
    `Cấp độ: ${experienceLevel} | ` +
    `Điểm tổng: ${overallScore}/100 (${grade}). ` +
    `Nhận diện ${skillsBreakdown.matchedKeywords.length} kỹ năng phù hợp. ` +
    (certBreakdown.found.length > 0
      ? `Chứng chỉ: ${certBreakdown.found.join(', ')}.`
      : 'Chưa có chứng chỉ nổi bật.');

  return {
    overallScore,
    grade,
    detectedRoles,
    experienceLevel,
    breakdown,
    strengths,
    improvements,
    summary,
    analysisSource: 'local_fallback',
  };
}

// ─────────────────────────────────────────────
// 14. API WRAPPER WITH FALLBACK
// ─────────────────────────────────────────────

/**
 * Analyze CV with Gemini API, automatically falling back to local engine
 * if the API is unavailable, returns an error, or exceeds quota.
 */
export async function analyzeCVWithFallback(
  cvText: string,
  targetRole: string,
  callGeminiAPI: (text: string, role: string) => Promise<CVAnalysisResult>,
): Promise<CVAnalysisResult> {
  try {
    const result = await callGeminiAPI(cvText, targetRole);
    return { ...result, analysisSource: 'gemini_api' };
  } catch (error: unknown) {
    const isQuotaError =
      error instanceof Error &&
      (error.message.includes('429') ||
        error.message.toLowerCase().includes('quota') ||
        error.message.toLowerCase().includes('rate limit'));

    console.warn(
      isQuotaError
        ? '[CV Analyzer] Gemini API quota exceeded — using local fallback.'
        : '[CV Analyzer] Gemini API error — using local fallback.',
      error,
    );

    return analyzeCVLocal(cvText, targetRole);
  }
}
