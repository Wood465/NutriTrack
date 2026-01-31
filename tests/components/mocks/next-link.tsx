import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: any;
  children: ReactNode;
};

export default function Link({ href, children, ...rest }: LinkProps) {
  const resolvedHref = typeof href === 'string' ? href : '#';
  return (
    <a href={resolvedHref} {...rest}>
      {children}
    </a>
  );
}
