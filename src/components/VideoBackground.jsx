import backgroundVideo from '../assets/vid/background.mp4';

const VideoBackground = () => {
  return (
    <video
      autoPlay
      loop
      muted
      className="video-background"
    >
      <source src={backgroundVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;
