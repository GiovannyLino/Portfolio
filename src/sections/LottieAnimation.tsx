// LottieAnimation.tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieAnimation = () => {
  return (
    <div style={{ maxWidth: 600, margin: '100px auto 40px' }}>
      <DotLottieReact
        src="https://lottie.host/12120921-1188-4ee7-a1af-928b01d9dfe6/2S463VGL1d.lottie"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;
