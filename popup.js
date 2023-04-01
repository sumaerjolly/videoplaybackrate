function setPlaybackRateValue(playbackRate) {
  const playbackRange = document.getElementById('playbackRange');
  const playbackRateDisplay = document.getElementById('playbackRate');
  playbackRange.value = playbackRate;
  playbackRateDisplay.innerText = playbackRate;
}

function updatePlaybackRateValue() {
  const selectedVideo = document.getElementById('videoSelect').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'getPlaybackRate', videoSrc: selectedVideo },
      (response) => {
        setPlaybackRateValue(response.playbackRate);
      }
    );
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'findVideos' }, (response) => {
    const videoSelect = document.getElementById('videoSelect');
    const playbackRange = document.getElementById('playbackRange');
    response.videos.forEach((video) => {
      const option = document.createElement('option');
      option.value = video.src;
      option.text = video.title;
      videoSelect.add(option);
    });

    updatePlaybackRateValue();

    videoSelect.addEventListener('change', () => {
      updatePlaybackRateValue();
    });

    playbackRange.addEventListener('input', () => {
      setPlaybackRateValue(playbackRange.value);
      const selectedVideo = videoSelect.value;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'setPlaybackRate',
        videoSrc: selectedVideo,
        playbackRateValue: playbackRange.value,
      });
    });
  });
});
