import { projectsSection, type Project } from '@/content';
import { ExternalLink } from './ExternalLink';
import { Tag } from './Tag';
import { Thumbnail } from './thumbnails/Thumbnail';

// A project card. Renders an <li>, so put it inside a <ul>. The card itself is not a link and
// has no hover state: only the two links inside it do.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="border-line bg-bg flex flex-col overflow-hidden rounded-lg border">
      <div role="img" aria-label={project.thumbnailAlt}>
        <Thumbnail kind={project.thumbnail} />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="[overflow-wrap:anywhere]">{project.title}</h3>
        <p className="text-muted [overflow-wrap:anywhere]">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </ul>
        {/* The visible text comes first, then the project name, so each link name is unique. */}
        <div className="mt-auto flex flex-wrap gap-x-5 pt-2">
          <ExternalLink href={project.demoUrl}>
            {projectsSection.demoLabel}
            <span className="sr-only"> of {project.title}</span>
          </ExternalLink>
          <ExternalLink href={project.sourceUrl}>
            {projectsSection.sourceLabel}
            <span className="sr-only"> code of {project.title}</span>
          </ExternalLink>
        </div>
      </div>
    </li>
  );
}
