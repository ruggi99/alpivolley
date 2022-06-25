import cs from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export function Navigation({ className }) {
  const router = useRouter();
  return (
    <div className={cs("w-min", className)}>
      <Link href={router.pathname == "/404" ? "/" : router.asPath + "/../"}>
        <a>
          <button className="rounded-md border px-4 py-2">Indietro</button>
        </a>
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
