export const getScaling = () => {
  let scalingFactor = 1;
  const isHighDensity =
    (window.matchMedia &&
      (window.matchMedia(
        'only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)'
      ).matches ||
        window.matchMedia(
          'only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)'
        ).matches)) ||
    (window.devicePixelRatio && 1.3 < window.devicePixelRatio);
  const isRetina =
    ((window.matchMedia &&
      (window.matchMedia(
        'only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)'
      ).matches ||
        window.matchMedia(
          'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)'
        ).matches)) ||
      (window.devicePixelRatio && 2 <= window.devicePixelRatio)) &&
    !/(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (!isMobile && isRetina) {
    if (isRetina) {
      document.body.classList.add('retina');
      scalingFactor = 1.5;
    } else if (isHighDensity) {
      document.body.classList.add('high-res');
      scalingFactor = 1.25;
    }
  }

  return scalingFactor;
};
