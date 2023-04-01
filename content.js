chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findVideos') {
    const videos = Array.from(document.getElementsByTagName('video'));
    const videoDataList = videos.map((video, index) => {
      const videoSrc = video.src || video.getElementsByTagName('source')[0].src;
      const videoTitle = video.title || `Video ${index + 1}`;
      return { src: videoSrc, title: videoTitle };
    });
    sendResponse({ videos: videoDataList });
  } else if (request.action === 'setPlaybackRate') {
    const videoSrc = request.videoSrc;
    const playbackRateValue = parseFloat(request.playbackRateValue);
    const videos = Array.from(document.getElementsByTagName('video'));

    videos.forEach((video) => {
      const src = video.src || video.getElementsByTagName('source')[0].src;
      if (src === videoSrc) {
        video.playbackRate = playbackRateValue;
      }
    });
  } else if (request.action === 'getPlaybackRate') {
    const videoSrc = request.videoSrc;
    const videos = Array.from(document.getElementsByTagName('video'));
    let playbackRate = 1;

    videos.forEach((video) => {
      const src = video.src || video.getElementsByTagName('source')[0].src;
      if (src === videoSrc) {
        playbackRate = video.playbackRate;
      }
    });

    sendResponse({ playbackRate: playbackRate });
  }
  return true;
});
