interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * The "GL" monogram: two block letters on a 32-unit grid. The G takes the text colour and
 * the L the accent. public/favicon.svg and the preloader in index.html draw the same shapes.
 */
export const LogoMark = ({ size = 32, className }: LogoMarkProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M4 6h10.5v3.5h-7v13h3.5V18.5H9V15h5.5v11H4z" />
    <path fill="hsl(var(--primary))" d="M17.5 6H21v16.5h7V26H17.5z" />
  </svg>
);
