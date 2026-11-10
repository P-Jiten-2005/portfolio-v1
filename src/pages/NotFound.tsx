import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page py-32 text-center">
      <p className="label text-accent">404 · Target lost</p>
      <h1 className="mt-4 text-5xl font-bold">Nothing at this address.</h1>
      <Link to="/work" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-night">
        Go to the projects →
      </Link>
    </div>
  );
}
