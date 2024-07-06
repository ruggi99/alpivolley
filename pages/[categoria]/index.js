import { useRouter } from "next/router";

import { ButtonWithLink } from "components/Button";
import Grid from "components/Grid";
import Title from "components/Title";
import { CATEGORIE, DATA } from "lib/const";
import { firstLetterUp } from "lib/utils";

function Gironi() {
  const { query } = useRouter();
  return (
    <div className="mx-auto grid h-full place-content-center gap-4">
      <Title>{firstLetterUp(query.categoria) + " - Gironi"}</Title>
      <h2 className="text-center">
        Categoria {firstLetterUp(query.categoria)}
      </h2>
      <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
        {Array(DATA[query.categoria].gironi)
          .fill(0)
          .map((_, i) => (
            <ButtonWithLink
              className="whitespace-nowrap"
              key={i}
              href={String.fromCharCode(65 + i)}
            >
              Girone {String.fromCharCode(65 + i)}
            </ButtonWithLink>
          ))}
      </Grid>
      <div>
        <ButtonWithLink href="avulsa">Classifica Avulsa</ButtonWithLink>
      </div>
    </div>
  );
}

export default Gironi;

export function getStaticProps({ params }) {
  if (!CATEGORIE.includes(params.categoria)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      gironi: DATA[params.categoria].gironi,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: Object.keys(DATA).map((v) => "/" + v),
    fallback: false,
  };
}
