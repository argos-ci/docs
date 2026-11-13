import clsx from "clsx";

export function Figure(props: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
}) {
  const { src, alt, className, width } = props;
  return (
    <figure className={clsx("m-0 flex flex-col items-center", className)}>
      <img
        className="h-auto max-w-full rounded border object-cover"
        src={src}
        alt={alt}
        width={width}
      />
      <figcaption className="mt-7 text-center text-[14px] text-low!">
        {alt}
      </figcaption>
    </figure>
  );
}
