import { ButtonWithLink } from "components/Button";
import Title from "components/Title";

export default function Home() {
  return (
    <div className="m-auto grid h-full place-content-center">
      <Title>Categorie</Title>
      <div className="grid justify-items-stretch space-y-4">
        <h3>Seleziona una categoria</h3>
        <ButtonWithLink href="/men">MEN</ButtonWithLink>
        <ButtonWithLink href="/mixed">MIXED</ButtonWithLink>
        <ButtonWithLink href="/women">WOMEN</ButtonWithLink>
      </div>
    </div>
  );
}
