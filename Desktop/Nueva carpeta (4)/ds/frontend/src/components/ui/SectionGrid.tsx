import type { ReactNode } from 'react';

/**
 * Grid responsive para campos de formulario.
 * - cols 2 → grid-2  (2 columnas, colapsa a 1 en mobile)
 * - cols 3 → grid-3  (3 columnas, colapsa a 2 en tablet, 1 en mobile)
 * - variant "checks" → grid-checks (auto-fill minmax 180px)
 */
interface SectionGridProps {
    readonly cols?: 2 | 3;
    readonly variant?: 'checks';
    readonly className?: string;
    readonly children: ReactNode;
}

export default function SectionGrid({ cols = 2, variant, className = '', children }: SectionGridProps) {
    const gridClass = variant === 'checks' ? 'grid-checks' : `grid-${cols}`;
    return (
        <div className={`${gridClass} ${className}`.trim()}>
            {children}
        </div>
    );
}
