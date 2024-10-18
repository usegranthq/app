'use client';

import { createContext, useContext } from 'react';

import { Project } from '@/types/app.types';

interface ProjectContextType {
  project: Project;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  project: Project;
  children: React.ReactNode;
}

export const ProjectProvider = ({ project, children }: ProjectProviderProps) => {
  return <ProjectContext.Provider value={{ project }}>{children}</ProjectContext.Provider>;
};
