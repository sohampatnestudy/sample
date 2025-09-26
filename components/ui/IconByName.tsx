
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconByNameProps extends LucideProps {
  name: string;
}

const IconByName: React.FC<IconByNameProps> = ({ name, ...props }) => {
  // Dynamically access the icon component, with a fallback to 'Clock'
  const LucideIcon = (LucideIcons as any)[name] ?? LucideIcons.Clock;
  return <LucideIcon {...props} />;
};

export default IconByName;
