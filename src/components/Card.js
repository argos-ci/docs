import { ChevronRight } from "@site/src/components/icons/ChevronRight";
import Link from "@docusaurus/Link";

export function XCard({ logo, text, to, className }) {
  return (
    <Link to={to} className="no-underline! text hover:text group transition">
      <div className="border-[0.5px] rounded-lg transition group-hover:border-(--primary-8) flex flex-col gap-2 font-medium p-4">
        <div className="dark:bg-white rounded border-[0.5px] p-1 size-10 grid place-items-center">
          <img src={logo} className="m-0! size-6" />
        </div>
        <div className="flex items-center gap-2">
          {text}
          <ChevronRight className="size-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
