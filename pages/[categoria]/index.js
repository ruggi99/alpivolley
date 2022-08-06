import { useRouter } from "next/router";

import { ButtonWithLink } from "components/Button";
import Title from "components/Title";
import { categorie, gironi } from "lib/const";

function Gironi({ gironi }) {
  const { query } = useRouter();
  return (
    <div className="mx-auto grid h-full place-content-center gap-4">
      <Title>{query.categoria + " - Gironi"}</Title>
      <h3 className="text-center">
        Categoria {firstLetterUp(query.categoria)}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Array(gironi)
          .fill(0)
          .map((_, i) => (
            <ButtonWithLink key={i} href={String.fromCharCode(65 + i)}>
              Girone {String.fromCharCode(65 + i)}
            </ButtonWithLink>
          ))}
      </div>
      <div>
        <ButtonWithLink href="avulsa">Classifica Avulsa</ButtonWithLink>
      </div>
    </div>
  );
}

export default Gironi;

export function getStaticProps({ params }) {
  // TODO: fare il fetch da Google
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
