import { useEffect, useRef, useState } from 'react';

const ArticleCarousel = ({ banners, autoplayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const carouselRef = useRef(null);

  const slideTo = (targetImageNumber: number) => {
    let carouselWidth = carouselRef.current?.clientWidth;
    let targetXPixel = carouselWidth * targetImageNumber + 1;
    carouselRef.current?.scrollTo(targetXPixel, 0);
  };

  const handleNextSlide = () => {
    const nextIndex = (currentSlide + 1) % banners.length;
    setCurrentSlide(nextIndex);
    slideTo(nextIndex);
  };

  const handlePreviousSlide = () => {
    const prevIndex = (currentSlide - 1 + banners.length) % banners.length;
    setCurrentSlide(prevIndex);
    slideTo(prevIndex);
  };

  useEffect(() => {
    if (!isAutoplayActive) return;
    const intervalId = setInterval(handleNextSlide, autoplayInterval);
    return () => clearInterval(intervalId);
  }, [currentSlide, isAutoplayActive, autoplayInterval]);

  return (
    <div className="relative">
      <a
        onClick={handlePreviousSlide}
        className="btn btn-circle absolute left-5 top-1/2 transform -translate-y-1/2 z-50 opacity-40"
      >
        ❮
      </a>
      <a
        onClick={handleNextSlide}
        className="btn btn-circle absolute right-5 top-1/2 transform -translate-y-1/2 z-50 opacity-40"
      >
        ❯
      </a>
      <div className="carousel w-full" ref={carouselRef}>
        {banners.map((el, idx) => (
          <div
            key={idx}
            id={`slide${idx}`}
            className={`carousel-item relative w-full transition ease-in-out duration-700`}
          >
            <img src={el.url} className="w-full" />
            {/* <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"></div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleCarousel;
