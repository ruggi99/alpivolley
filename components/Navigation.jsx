import Link from "next/link";
import { useRouter } from "next/router";

import cs from "classnames";

export function Navigation({ className }) {
  const router = useRouter();
  if (router.asPath == "/") return null;
  return (
    <div className={cs("w-min", className)}>
      <Link href={router.pathname == "/404" ? "/" : router.asPath + "/.."}>
        <button className="rounded-md border px-4 py-2">Indietro</button>
      </Link>
    </div>
  );
}

export function withNavigation(Comp) {
  function WithNavigationWrapper(props) {
    return (
      <>
        <Navigation />
        <Comp {...props} />
      </>
    );
  }
  WithNavigationWrapper.displayName = "WithNavigation";
  return WithNavigationWrapper;
}
