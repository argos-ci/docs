import { ChevronRight } from "@site/src/components/icons/ChevronRight";
import Link from "@docusaurus/Link";

export function XCard({ logo, text, to, className }) {
  return (
    <Link to={to} className="no-underline! text hover:text group transition">
      <div className="border rounded-lg transition group-hover:border-(--primary-8) flex items-center gap-4 font-medium p-4">
        <div className="bg-white rounded-full p-1">
          <img src={logo} width={48} height={48} className="m-0!" />
        </div>
        <div>{text}</div>
        <ChevronRight className="size-5 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
