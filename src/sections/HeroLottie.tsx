// src/components/HeroLottie.tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HeroLottie = () => {
  return (
    <div className="flex justify-center mb-8">
      <DotLottieReact
        src="https://lottie.host/7e1a4148-d1ed-4aee-a317-787f75e2cc1e/qGrtePua0a.lottie"
        loop
        autoplay
        style={{ width: '300px', height: '300px' }} // ajuste conforme desejar
      />
    </div>
  );
};

export default HeroLottie;
