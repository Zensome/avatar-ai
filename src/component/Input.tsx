export function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      type="text"
      className="border border-gray-300 px-4 py-2 dark:text-gray-800"
      {...props}
    ></input>
  );
}
