export function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input type="text" className="border border-gray-300" {...props}></input>
  );
}
