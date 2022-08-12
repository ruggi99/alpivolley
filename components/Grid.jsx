import { useId } from "react";

export default function Grid({ children, gap, rows, ...props }) {
  const id = useId().replaceAll(":", "");
  return (
    <div {...props} id={id}>
      <style
        dangerouslySetInnerHTML={{
          __html: `#${id} > * {flex-basis: ${
            100 / (rows + gap)
          }%; flex-grow: 1;}`,
        }}
      />
      {children}
    </div>
  );
}
