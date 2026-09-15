import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as RouterLink } from "react-router";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  replace?: boolean;
}

/**
 * The site's link.
 *
 * A page on this site opens in the browser without a reload; anything else —
 * tel:, mailto:, wa.me, another domain — stays an ordinary <a>, which React
 * Router does on its own for absolute URLs.
 *
 * Takes `href`, like an anchor, rather than React Router's `to`, so a link reads
 * the same whether it goes somewhere on the site or off it.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...props }, ref) {
  return <RouterLink ref={ref} to={href} {...props} />;
});

export default Link;
