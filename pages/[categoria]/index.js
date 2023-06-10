import { useRouter } from "next/router";

import { ButtonWithLink } from "components/Button";
import Grid from "components/Grid";
import Title from "components/Title";
import { categorie, gironi } from "lib/const";
import { firstLetterUp } from "lib/utils";

function Gironi() {
  const { query } = useRouter();
  return (
    <div className="mx-auto grid h-full place-content-center gap-4">
      <Title>{firstLetterUp(query.categoria) + " - Gironi"}</Title>
      <h3 className="text-center">
        Categoria {firstLetterUp(query.categoria)}
      </h3>
        <Grid key={i} className="flex flex-wrap gap-4" rows={2} gap={true}>
          {Array(15)
            .fill(0)
            .map((_, k) => (
              <ButtonWithLink
                className="whitespace-nowrap"
                key={k}
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
  return {
    props: {
      gironi: gironi[params.categoria],
    },
  };
}

export function getStaticPaths() {
  return {
    paths: categorie.map((v) => "/" + v),
    fallback: false,
  };
}
