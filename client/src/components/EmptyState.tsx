import type {ReactNode} from 'react';
import Icon, {type IconName} from './Icon.tsx';

export default function EmptyState({icon = 'search', title, children}: {
  icon?: IconName; title: string; children: ReactNode;
}) {
  return <div className="empty-state">
    <span className="round-symbol"><Icon name={icon} size={28}/></span>
    <h2>{title}</h2>
    {children}
  </div>;
}
