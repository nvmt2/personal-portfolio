import { projects, projectsSection } from '@/content';
import { ProjectCard } from './ProjectCard';
import { Section } from './Section';

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      title={projectsSection.title}
      intro={projectsSection.intro}
      tone="surface"
    >
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ul>
    </Section>
  );
}
