export const ROLE_KNOWLEDGE_BASE = {
  frontend: [
    'react', 'vue', 'angular', 'nextjs', 'typescript', 'javascript', 'html', 'css', 
    'tailwind', 'sass', 'redux', 'context api', 'webpack', 'vite', 'ui/ux', 'responsive'
  ],
  backend: [
    'nodejs', 'nest', 'express', 'java', 'spring boot', 'python', 'django', 'flask', 
    'c#', '.net', 'golang', 'php', 'laravel', 'sql', 'mysql', 'postgresql', 'mongodb', 
    'redis', 'api', 'restful', 'graphql', 'microservices', 'docker', 'kafka'
  ],
  mobile: [
    'flutter', 'react native', 'swift', 'ios', 'kotlin', 'android', 'dart', 'objective-c',
    'xcode', 'android studio', 'mobile app', 'firebase'
  ],
  devops: [
    'docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'aws', 
    'azure', 'gcp', 'linux', 'bash', 'shell', 'nginx', 'prometheus', 'grafana', 'sre'
  ],
  data: [
    'python', 'r', 'sql', 'machine learning', 'deep learning', 'data analysis', 
    'data visualization', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 
    'spark', 'hadoop', 'tableau', 'power bi', 'big data'
  ],
  tester: [
    'automation test', 'manual test', 'selenium', 'cypress', 'playwright', 'jest', 
    'unit test', 'integration test', 'test case', 'test plan', 'bug report', 'jira', 
    'postman', 'api testing'
  ],
  design: [
    'figma', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'design thinking', 
    'wireframe', 'prototype', 'graphic design', 'layout', 'typography'
  ],
  management: [
    'project management', 'agile', 'scrum', 'kanban', 'requirement', 'srs', 'user story', 
    'product owner', 'scrum master', 'stakeholder', 'backlog', 'jira', 'trello'
  ],
  marketing: [
    'seo', 'sem', 'content marketing', 'social media', 'google ads', 'facebook ads', 
    'email marketing', 'analytics', 'marketing strategy', 'branding', 'copywriting'
  ],
  soft_skills: [
    'teamwork', 'communication', 'problem solving', 'time management', 'leadership', 
    'critical thinking', 'presentation', 'english', 'tiếng anh'
  ]
};

export const ROLE_MAPPING = {
  'frontend': 'frontend',
  'front-end': 'frontend',
  'web': 'frontend',
  'backend': 'backend',
  'back-end': 'backend',
  'node': 'backend',
  'java': 'backend',
  'python': 'backend',
  'fullstack': ['frontend', 'backend'],
  'full-stack': ['frontend', 'backend'],
  'mobile': 'mobile',
  'android': 'mobile',
  'ios': 'mobile',
  'flutter': 'mobile',
  'devops': 'devops',
  'cloud': 'devops',
  'aws': 'devops',
  'data': 'data',
  'ai': 'data',
  'machine learning': 'data',
  'tester': 'tester',
  'qa': 'tester',
  'qc': 'tester',
  'kiểm thử': 'tester',
  'design': 'design',
  'ui': 'design',
  'ux': 'design',
  'designer': 'design',
  'manager': 'management',
  'pm': 'management',
  'ba': 'management',
  'analyst': 'management',
  'marketing': 'marketing',
  'seo': 'marketing',
  'sale': 'marketing'
};
