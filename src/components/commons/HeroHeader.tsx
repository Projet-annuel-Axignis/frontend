import Image from 'next/image';

interface HeroHeaderProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const HeroHeader = ({ title, description, image, imageAlt }: HeroHeaderProps) => {
  return (
    <section className="
        relative 
        overflow-hidden
        h-[50vh] 
        min-h-[400px]
        pt-24
        flex 
        items-center 
        justify-center
        text-white
      ">
      {/* Arrière-plan avec image */}
      <div className="
          absolute 
          inset-0 
          bg-gray-600
          z-0
        ">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="
              object-cover
              opacity-50
              mix-blend-overlay
            "
        />
      </div>

      {/* Overlay avec dégradé */}
      <div className="
          absolute 
          inset-0 
          bg-gradient-to-r 
          from-[var(--color-axignis-primary)]/70
          to-[var(--color-axignis-secondary)]/70
          mix-blend-multiply
          z-10
        "></div>

      {/* Contenu du hero */}
      <div className="
          relative 
          z-30 
          max-w-5xl 
          px-6
          text-center
        ">
        <h1 className="
            text-4xl 
            md:text-5xl 
            lg:text-6xl 
            font-bold 
            mb-6
            drop-shadow-lg
          ">
          {title}
        </h1>
        <p className="
            text-xl 
            md:text-2xl 
            mb-6
            max-w-3xl 
            mx-auto
            font-light
            drop-shadow-md
          ">
          {description}
        </p>
        <div className="
            w-24
            h-1
            bg-white
            mx-auto
            mb-4
            opacity-70
          "></div>
      </div>
    </section>

  )
}

export default HeroHeader