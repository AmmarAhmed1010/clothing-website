import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty-state">
      <p className="eyebrow">404 / A LITTLE LOST</p>
      <h1>Find your form.</h1>
      <p>This page isn’t in the collection.</p>
      <Link className="retail-button" href="/shop">
        Browse all pieces →
      </Link>
    </section>
  );
}
