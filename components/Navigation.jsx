import Link from "next/link";
import { useRouter } from "next/router";

export function Navigation() {
  const router = useRouter();
  return (
    <div className="w-min">
      <Link href={router.asPath + "/../"}>
        <a>
          <button className="rounded-md border px-4 py-2">Indietro</button>
        </a>
      </Link>
    </div>
  );
}

export function withNavigation(Comp) {
  function withNavigationWrapper(props) {
    return (
      <>
        <Navigation />
        <Comp {...props} />
      </>
    );
  }
  withNavigationWrapper.displayName = "withNavigation";
  return withNavigationWrapper;
}
