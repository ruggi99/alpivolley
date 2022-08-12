import { ButtonWithLink } from "components/Button";
import Title from "components/Title";
import { categorie } from "lib/const";

export default function Home() {
  return (
    <div className="m-auto grid h-full place-content-center">
      <Title>Categorie</Title>
      <div className="grid justify-items-stretch space-y-4">
        <h3>Seleziona una categoria</h3>
        <ButtonWithLink href={"/" + categorie[0]}>
          {categorie[0].toUpperCase()}
        </ButtonWithLink>
        <ButtonWithLink href={"/" + categorie[1]}>
          {categorie[1].toUpperCase()}
        </ButtonWithLink>
        <ButtonWithLink href={"/" + categorie[2]}>
          {categorie[2].toUpperCase()}
        </ButtonWithLink>
      </div>
    </div>
  );
}
