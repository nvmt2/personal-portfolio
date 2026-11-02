import { skillGroups, skillsSection } from '@/content';
import { Chip } from './Chip';
import { Section } from './Section';

export function SkillsSection() {
  return (
    <Section
      id="skills"
      title={skillsSection.title}
      intro={skillsSection.intro}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-8">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-base font-semibold [overflow-wrap:anywhere]">
              {group.name}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
