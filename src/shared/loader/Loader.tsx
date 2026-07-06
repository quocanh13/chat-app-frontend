import "./Loader.css";

interface LoaderProps {
  className?: string;
}

export function Loader({ className = "" }: LoaderProps) {
  return <div className={`loader ${className}`} />;
}