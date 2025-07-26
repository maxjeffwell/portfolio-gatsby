// Web Worker for filtering projects to offload computation from main thread
// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const { projects, filters } = e.data;

  try {
    // Perform heavy filtering operations on separate thread
    const filteredProjects = projects.filter((project) => {
      // Technology filter
      if (filters.technologies.length > 0) {
        const hasMatchingTech = filters.technologies.some((tech) =>
          project.technologies.some((projectTech) =>
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        );
        if (!hasMatchingTech) return false;
      }

      // Year filter (if needed)
      if (filters.year && project.year !== filters.year) {
        return false;
      }

      // Search text filter (if needed)
      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        const searchableText = [project.title, project.description, ...project.technologies]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    // Sort by date (newest first)
    filteredProjects.sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      return yearB - yearA;
    });

    // Send results back to main thread
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
      success: true,
      filteredProjects,
    });
  } catch (error) {
    // Send error back to main thread
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
      success: false,
      error: error.message,
    });
  }
};
