const API_URL = 'https://perfanalytics--api.herokuapp.com/metrics';
const toSecond = (ms) => (ms / 1000).toFixed(4);
window.onload = () => {
  if ('performance' in window) {
    const { timing } = performance;
    const FCB = toSecond(performance.getEntriesByType('paint')[0].startTime);

    const TTFB = toSecond(timing.responseStart - timing.requestStart);

    const _DOMLoad = toSecond(
      timing.domContentLoadedEventEnd - timing.navigationStart
    );

    const _WindowLoad = toSecond(new Date() - timing.navigationStart);

    const files = performance.getEntriesByType('resource').map((entry) => ({
      name: entry.name,
      file_type: entry.initiatorType,
      response_end: toSecond(entry.responseEnd),
    }));

    const metrics = {
      site: window.location.hostname,
      url: window.location.href,
      fcp: FCB,
      ttfb: TTFB,
      dom_load: _DOMLoad,
      window_load: _WindowLoad,
      files: files,
      generated_at: new Date(timing.navigationStart).toString(),
    };
    sendMetrics(metrics);
  }
};

const sendMetrics = (data) => {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((e) => console.log('ERROR: ', e));
};
