import cs from "classnames";

export function SqRounded({ children, className, color }) {
  return (
    <div className={cs("rounded-xl p-2 px-4 py-1", color, className)}>
      {children}
    </div>
  );
}

export function Campo({ v }) {
  return (
    <>
      Campo{" "}
      <span
        className={cs(
          "grid h-8 w-8 place-items-center rounded-md font-semibold text-white",
          v["Campo"] ? "bg-green-600" : "bg-red-600",
        )}
      >
        {v["Campo"] || "ND"}
      </span>
    </>
  );
}
