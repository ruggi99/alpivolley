import { useRouter } from "next/router";

import { ButtonWithLink } from "components/Button";
import Grid from "components/Grid";
import Title from "components/Title";
import { BaseRow } from "lib/baserow";
import { CATEGORIE, GIRONI_LETTERS } from "lib/const";
import { firstLetterUp } from "lib/utils";

function Gironi(props) {
  const { query } = useRouter();
  return (
    <div className="mx-auto grid h-full max-w-2xl place-content-center gap-4">
      <Title>{firstLetterUp(query.categoria) + " - Gironi"}</Title>
      <h2 className="text-center">Categoria {firstLetterUp(query.categoria)}</h2>
      <hr />
      {props["Fase 1"] && (
        <>
          <h3 className="text-center">Fase 1</h3>
          <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i]}>
                  Girone {GIRONI_LETTERS[i]}
                </ButtonWithLink>
              ))}
          </Grid>
        </>
      )}
      {props["Fase 2"] && (
        <>
          <hr />
          <h3 className="text-center">Fase 2</h3>
          <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i + 4]}>
                  Girone {GIRONI_LETTERS[i + 4]}
                </ButtonWithLink>
              ))}
          </Grid>
        </>
      )}
      {props["Fase 3"] && (
        <>
          <hr />
          <h3 className="text-center">Fase 3</h3>
          <Grid className="flex flex-wrap gap-4" rows={2} gap={true}>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <ButtonWithLink className="whitespace-nowrap" key={i} href={GIRONI_LETTERS[i + 8]}>
                  Girone {GIRONI_LETTERS[i + 8]}
                </ButtonWithLink>
              ))}
          </Grid>
        </>
      )}
      <hr />
      <div>
        <ButtonWithLink href="avulsa">Classifica Avulsa</ButtonWithLink>
      </div>
      {props["Eliminazione"] && (
        <>
          <hr />
          <h3 className="text-center">Fase Eliminazione</h3>
          <div>
            <ButtonWithLink href="gold">Fase Gold</ButtonWithLink>
          </div>
        </>
      )}
    </div>
  );
}

export default Gironi;

export async function getStaticProps({ params }) {
  if (!CATEGORIE.includes(params.categoria)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const baserow = new BaseRow(process.env.BASEROW_TOKEN);
  const resp = await baserow.list_rows("MISTO", "Controlli").then((v) => v.json());
  return {
    props: resp.results.reduce((acc, v) => {
      acc[v.Nome] = v.Attivo;
      return acc;
    }, {}),
    revalidate: 60 * 5,
  };
}

export function getStaticPaths() {
  return {
    paths: CATEGORIE.map((v) => "/" + v),
    fallback: false,
  };
}
