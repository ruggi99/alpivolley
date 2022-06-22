import cs from "classnames"

export default function Button({className, ...props}) {
  return <button className={cs(className, "border rounded-xl py-4 px-8 w-full")} {...props}></button>
}