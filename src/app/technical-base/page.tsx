'use client';

import Drawer from '@/components/LeftMenu';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useTranslation } from '@/i18n/useTranslation';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <main className="flex-1 min-h-full bg-white dark:bg-gray-900 font-sans">
                    <div className='flex'> {/* Suppression de flex-wrap et w-full */}
                        <div className="w-64"> {/* Largeur fixe pour le Drawer */}
                            <Drawer />
                        </div>
                        <div className='flex-1'> {/* flex-1 pour occuper l'espace restant */}
                            <section className="
                                py-16
                                md:py-24 
                                px-4
                                md:px-6
                                bg-white
                                dark:bg-gray-900
                            ">
                                <div className="container mx-auto max-w-5xl">
                                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                                        <div className="w-full md:w-1/2 @container order-2 md:order-1">
                                            <h2 className="
                                                text-2xl sm:text-3xl @md:text-4xl 
                                                text-gray-900 dark:text-white mb-4 md:mb-6 relative
                                                before:content-[''] before:block before:w-16 before:h-1 
                                                before:bg-[var(--color-axignis-primary)] 
                                                before:mb-3 md:before:mb-4
                                            ">
                                                {/* Ton titre ici */}
                                            </h2>
                                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 md:mb-6">
                                                {/* Ton texte ici */}
                                            </p>
                                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                                                {/* Ton autre texte ici */}
                                            </p>
                                        </div>
                                        <div className="w-full md:w-1/2 aspect-video relative rounded-xl overflow-hidden shadow-xl order-1 md:order-2 mb-8 md:mb-0">
                                            {/* Ton image / vidéo ici */}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <Footer />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
