import { ButtonWithLink } from "components/Button";
import Title from "components/Title";
import { CATEGORIE } from "lib/const";

export default function Home() {
  return (
    <div className="m-auto grid h-full place-content-center">
      <Title>Categorie</Title>
      <div className="grid justify-items-stretch space-y-4">
        <h3>Seleziona una categoria</h3>
        {CATEGORIE.map((v) => (
          <ButtonWithLink key={v} href={"/" + v}>
            {v.toUpperCase()}
          </ButtonWithLink>
        ))}
      </div>
    </div>
  );
}
