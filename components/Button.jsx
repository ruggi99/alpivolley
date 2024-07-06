import Link from "next/link";
import { useRouter } from "next/router";

import cs from "classnames";

export default function Button({ className, ...props }) {
  return (
    <button
      className={cs(className, "w-full rounded-xl border px-8 py-4")}
      {...props}
    />
  );
}

export function ButtonWithLink({ children, href, ...props }) {
  const router = useRouter();
  return (
    <Link
      href={href[0] == "/" ? href : router.asPath + `/${href}`}
      rel="noopener"
      {...props}
    >
      <Button {...props}>{children}</Button>
    </Link>
  );
}
