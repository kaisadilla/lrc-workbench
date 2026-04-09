export type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SpanProps = React.HTMLAttributes<HTMLSpanElement>;
export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;
export type InputProps = React.ImgHTMLAttributes<HTMLInputElement>;
export type ButtonProps = React.ImgHTMLAttributes<HTMLButtonElement>;

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Vec2 {
  x: number;
  y: number;
}
