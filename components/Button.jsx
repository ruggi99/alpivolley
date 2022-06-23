import cs from "classnames";

export default function Button({ className, ...props }) {
  return (
    <button
      className={cs(className, "w-full rounded-xl border py-4 px-8")}
      {...props}
    />
  );
}
