import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/shop";
import { products } from "@/lib/catalog";
export default function Home() {
  return (
    <>
      <section className="fashion-hero">
        <div className="fashion-hero-copy">
          <p className="eyebrow">THE AUTUMN COLLECTION / 2026</p>
          <h1>
            Less noise.
            <br />
            More <em>you.</em>
          </h1>
          <p>
            Quiet confidence, in every layer.
            <br />
            Meet the pieces you’ll reach for again.
          </p>
          <Link className="retail-button" href="/collections/seasonal">
            Discover the collection <ArrowRight size={18} />
          </Link>
          <span className="hero-edition">01 — A NEW SEASON OF EVERYDAY</span>
        </div>
        <div className="fashion-hero-image">
          <Image
            src="/assets/editorial-woman.jpg"
            alt="Editorial fashion portrait in a blue coat, illustrative stock photography"
            fill
            loading="eager"
            sizes="(max-width:700px) 100vw, 58vw"
          />
          <span className="image-caption">THE ART OF GETTING DRESSED</span>
        </div>
      </section>
      <div className="retail-values">
        <span>Considered silhouettes</span>
        <span>Eastern & Western wardrobes</span>
        <span>Made for your everyday</span>
      </div>
      <section className="new-arrivals">
        <div className="simple-heading">
          <div>
            <p className="eyebrow">NEW & NOTEWORTHY</p>
            <h2>Your next favourites.</h2>
          </div>
          <Link className="text-link" href="/shop">
            Shop all pieces <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {[products[12], products[1], products[15], products[3]].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="catalog-footnote">
          Original garment illustrations for our fictional demo collection.
        </p>
      </section>
      <section className="department-features">
        <Link href="/women" className="department-feature">
          <div>
            <Image
              src="/assets/editorial-woman.jpg"
              alt="Womenswear editorial portrait"
              fill
              sizes="50vw"
            />
          </div>
          <span>
            <h2>For her.</h2>
            <span>
              Explore womenswear <ArrowUpRight size={19} />
            </span>
          </span>
        </Link>
        <Link href="/men" className="department-feature">
          <div>
            <Image
              src="/assets/editorial-man.jpg"
              alt="Menswear editorial portrait"
              fill
              sizes="50vw"
            />
          </div>
          <span>
            <h2>For him.</h2>
            <span>
              Explore menswear <ArrowUpRight size={19} />
            </span>
          </span>
        </Link>
      </section>
      <section className="eastern-editorial">
        <div className="editorial-number">02 / THE EASTERN EDIT</div>
        <div>
          <h2>
            Rooted in tradition.
            <br />
            <em>Worn your way.</em>
          </h2>
          <p>
            Easy kurtas, understated two-pieces and occasion-ready details.
            Familiar forms, with a fresh point of view.
          </p>
          <Link className="light-retail-button" href="/collections/eastern">
            Explore the Eastern edit <ArrowRight size={18} />
          </Link>
        </div>
        <div className="editorial-garment">
          <Image
            src={products[19].images[0]}
            alt="Burgundy Eastern kurta — original demo illustration"
            fill
            sizes="40vw"
          />
        </div>
      </section>
      <section className="wardrobe-note">
        <p className="eyebrow">THE FORME POINT OF VIEW</p>
        <h2>
          A few good pieces.
          <br />
          <em>Endless possibilities.</em>
        </h2>
        <p>
          Dress for the day you’re having. Keep the things that feel like you.
          <br />
          Build a wardrobe with room to breathe.
        </p>
        <Link className="text-link" href="/shop">
          Find your form <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
