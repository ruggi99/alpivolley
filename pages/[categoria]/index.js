import { useRouter } from "next/router";

import { ButtonWithLink } from "components/Button";
import Grid from "components/Grid";
import Title from "components/Title";
import { CATEGORIE, GIRONI_LETTERS, GIRONI_VALUES } from "lib/const";
import { firstLetterUp } from "lib/utils";

function Gironi() {
  const { query } = useRouter();
  return (
    <div className="mx-auto grid h-full max-w-2xl place-content-center gap-4">
      <Title>{firstLetterUp(query.categoria) + " - Gironi"}</Title>
      <h2 className="text-center">Categoria {firstLetterUp(query.categoria)}</h2>
      <hr />
      <h3 className="text-center">Fase 1</h3>
      <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
        {/* {Array(DATA[query.categoria].gironi) */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i]}>
              {GIRONI_VALUES[i]}
            </ButtonWithLink>
          ))}
      </Grid>
      <hr />
      <h3 className="text-center">Fase 2</h3>
      <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
        {/* {Array(DATA[query.categoria].gironi) */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i + 5]}>
              {GIRONI_VALUES[i + 5]}
            </ButtonWithLink>
          ))}
      </Grid>
      <hr />
      <h3 className="text-center">Fase 3</h3>
      <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
        {/* {Array(DATA[query.categoria].gironi) */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i + 10]}>
              {GIRONI_VALUES[i + 10]}
            </ButtonWithLink>
          ))}
      </Grid>
      <hr />
      <h3 className="text-center">Fase Eliminazione</h3>
      <div>
        <ButtonWithLink href="avulsa">Classifica Avulsa</ButtonWithLink>
      </div>
      <div>
        <ButtonWithLink href="gold">Fase Gold</ButtonWithLink>
      </div>
      <div>
        <ButtonWithLink href="silver">Fase Silver</ButtonWithLink>
      </div>
      {/* <div>
        <ButtonWithLink href="bronze">Fase Bronze</ButtonWithLink>
      </div> */}
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
    props: {},
  };
}

export function getStaticPaths() {
  return {
    paths: CATEGORIE.map((v) => "/" + v),
    fallback: false,
  };
}
