import clsx from "clsx";
import { Spinner } from "./Spinner";

export function Button(
  props: React.ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary";
    isLoading?: boolean;
  }
) {
  const { variant, isLoading, ...rest } = props;

  const color =
    (variant ?? "primary") === "primary"
      ? "bg-indigo-400 hover:bg-indigo-500"
      : "bg-gray-400 hover:bg-gray-500";

  return (
    <button
      {...rest}
      className={clsx(
        "flex w-28 items-center justify-center gap-2 rounded px-3 py-2 disabled:bg-gray-600",
        color
      )}
    >
      {isLoading && <Spinner />}
      {props.children}
    </button>
  );
}
