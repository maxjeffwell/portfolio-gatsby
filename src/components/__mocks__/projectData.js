export const mockProject = {
  title: 'Bookmarked',
  date: '2024-01-15',
  description:
    'A full-stack bookmark manager with semantic search powered by Neon PostgreSQL and pgvector embeddings. Features include tag-based organization, full-text search, and responsive design.',
  source: [
    { url: 'https://github.com/maxjeffwell/bookmarks-react-hooks', label: 'Frontend' },
    { url: 'https://github.com/maxjeffwell/bookmarks-server', label: 'Backend' },
  ],
  hosted: [{ url: 'https://bookmarked.el-jefe.me', label: 'Live Demo' }],
  techIcons: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
  image: null,
  video: null,
};

export const mockProjectWithVideo = {
  ...mockProject,
  title: 'IntervalAI',
  description:
    'Spaced repetition learning platform with AI-powered flashcards and interval scheduling.',
  video: { publicURL: 'https://example.com/demo.mp4' },
  techIcons: ['React', 'Node.js', 'MongoDB', 'Docker'],
  hosted: [{ url: 'https://intervalai.el-jefe.me', label: 'Live Demo' }],
};

export const mockProjectMinimal = {
  title: 'Firebook',
  date: '2023-06-01',
  description: 'Social bookmarking app built with Firebase for real-time data sync.',
  source: [{ url: 'https://github.com/maxjeffwell/firebook', label: 'Source' }],
  hosted: [],
  techIcons: ['React', 'Firebase'],
  image: null,
  video: null,
};
