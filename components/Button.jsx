import Link from "next/link";
import { useRouter } from "next/router";

import cs from "classnames";

export default function Button({ className, ...props }) {
  return (
    <button
      className={cs(className, "w-full rounded-xl border py-4 px-8")}
      {...props}
    />
  );
}

export function ButtonWithLink({ children, href, ...props }) {
  const router = useRouter();
  return (
    <Link href={href[0] == "/" ? href : router.asPath + `/${href}`}>
      <a {...props} rel="noopener">
        <Button {...props}>{children}</Button>
      </a>
    </Link>
  );
}
