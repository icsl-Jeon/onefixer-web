const scenes = [
  { id: "segment-3385534893506316900_4252_000_4272_000_with_camera_labels", frames: 197, fps: 24 },
  { id: "segment-3132521568089292927_2220_000_2240_000_with_camera_labels", frames: 197, fps: 24 },
  { id: "segment-2681180680221317256_1144_000_1164_000_with_camera_labels", frames: 197, fps: 24 },
];
const models = [
  { key: "difix3d", label: "DiFix3D", group: "Image model" },
  { key: "gsfix3d", label: "GSFix3D", group: "Image model" },
  { key: "harmonizer", label: "DiffusionHarmonizer", group: "Image model" },
  { key: "enhancer3dgs", label: "3DGS Enhancer", group: "Bidirectional model" },
  { key: "omnidreams", label: "OmniDreams", group: "Causal model" },
  { key: "artifixer", label: "ArtiFixer", group: "Causal model" },
  { key: "oneforcing", label: "One-Forcing<sup class=\"model-dagger\">†</sup>", group: "Causal model" },
  { key: "selfforcing", label: "Self-Forcing<sup class=\"model-dagger\">†</sup>", group: "Causal model" },
  { key: "onefixer", label: "OneFixer (Ours)", group: "Causal model", locked: true },
];
const internalModelKeys = new Set(["difix3d", "gsfix3d", "harmonizer", "enhancer3dgs", "omnidreams", "artifixer", "selfforcing", "onefixer"]);
const internalModels = models.filter(model => internalModelKeys.has(model.key));

const compare = document.querySelector("#compare");
const split = document.querySelector("#split");
const inputFrame = document.querySelector("#inputFrame");
const outputFrame = document.querySelector("#outputFrame");
const playButton = document.querySelector("#play");
const timeline = document.querySelector("#timeline");
const frameLabel = document.querySelector("#frame");
const mainFrameLoader = document.querySelector("#mainFrameLoader");
const sceneButtons = [...document.querySelectorAll("[data-scene]")];
const modelPicker = document.querySelector("#modelPicker");
const modelGrid = document.querySelector("#modelGrid");
const cmpInput = document.querySelector("#cmpInput");
const cmpGt = document.querySelector("#cmpGt");
const cmpPlayButton = document.querySelector("#cmpPlay");
const cmpTimeline = document.querySelector("#cmpTimeline");
const cmpFrameLabel = document.querySelector("#cmpFrame");
const mainScrubber = document.querySelector("#mainScrubber");
const cmpScrubber = document.querySelector("#cmpScrubber");
const mainLoadedLabel = document.querySelector("#mainLoaded");
const cmpLoadedLabel = document.querySelector("#cmpLoaded");
const waymoThumbs = document.querySelector("#waymoThumbs");
const internalModelPicker = document.querySelector("#internalModelPicker");
const internalModelGrid = document.querySelector("#internalModelGrid");
const internalInput = document.querySelector("#internalInput");
const internalGt = document.querySelector("#internalGt");
const internalPlayButton = document.querySelector("#internalPlay");
const internalTimeline = document.querySelector("#internalTimeline");
const internalFrameLabel = document.querySelector("#internalFrame");
const internalScrubber = document.querySelector("#internalScrubber");
const internalLoadedLabel = document.querySelector("#internalLoaded");
const internalThumbs = document.querySelector("#internalThumbs");
const nondrivingModelGrid = document.querySelector("#nondrivingModelGrid");
const nondrivingInput = document.querySelector("#nondrivingInput");
const nondrivingGt = document.querySelector("#nondrivingGt");
const nondrivingPlayButton = document.querySelector("#nondrivingPlay");
const nondrivingTimeline = document.querySelector("#nondrivingTimeline");
const nondrivingFrameLabel = document.querySelector("#nondrivingFrame");
const nondrivingScrubber = document.querySelector("#nondrivingScrubber");
const nondrivingLoadedLabel = document.querySelector("#nondrivingLoaded");
const nondrivingThumbs = document.querySelector("#nondrivingThumbs");
const novelFigure = document.querySelector("#novelFigure");
const novelSelectors = document.querySelector("#novelSelectors");
const novelComposite = document.querySelector("#novelComposite");
const novelPlayButton = document.querySelector("#novelPlay");
const novelTimeline = document.querySelector("#novelTimeline");
const novelFrameLabel = document.querySelector("#novelFrame");
const novelThumbs = document.querySelector("#novelThumbs");
const closedLoopVideo = document.querySelector("#closedLoopVideo");
const closedLoopCaption = document.querySelector("#closedLoopCaption");
const closedLoopThumbs = document.querySelector("#closedLoopThumbs");
const closedLoopPlay = document.querySelector("#closedLoopPlay");
const closedLoopTimeline = document.querySelector("#closedLoopTimeline");
const closedLoopTime = document.querySelector("#closedLoopTime");
const closedLoopLoader = document.querySelector("#closedLoopLoader");
const stylizationVideos = [...document.querySelectorAll("[data-style-video]")];
const stylizationThumbs = document.querySelector("#stylizationThumbs");
const stylizationPlay = document.querySelector("#stylizationPlay");
const stylizationTimeline = document.querySelector("#stylizationTimeline");
const stylizationTime = document.querySelector("#stylizationTime");
const multicamVideo = document.querySelector("#multicamVideo");
const multicamThumbs = document.querySelector("#multicamThumbs");
const multicamPlay = document.querySelector("#multicamPlay");
const multicamTimeline = document.querySelector("#multicamTimeline");
const multicamTime = document.querySelector("#multicamTime");
const multicamLoader = document.querySelector("#multicamLoader");
const highresImage = document.querySelector("#highresImage");
const highresThumbs = document.querySelector("#highresThumbs");
const highresLoader = document.querySelector("#highresLoader");
const motivationVideos = [...document.querySelectorAll(".motivation-grid video")];
const motivationPlayButton = document.querySelector("#motivationPlay");
const motivationTimeline = document.querySelector("#motivationTimeline");
const motivationFrameLabel = document.querySelector("#motivationFrame");
const motivationScrubber = document.querySelector("#motivationScrubber");
const motivationLoadedLabel = document.querySelector("#motivationLoaded");
const motivationLoader = document.querySelector("#motivationLoader");
let scene = 0;
let frame = 0;
let cmpFrame = 0;
let internalFrame = 0;
let nondrivingFrame = 0;
let novelFrame = 0;
let motivationPlaying = true;
let motivationFrames = 300;
let motivationFetchProgress = 0;
const motivationFps = 10;
const motivationStartFrame = 0;
let playing = false;
let mainAutoplayPending = true;
let mainStartupToken = 0;
let cmpPlaying = true;
let internalPlaying = true;
let nondrivingPlaying = true;
let comparisonStarted = false;
let internalStarted = false;
let internalVideoTickStarted = false;
let nondrivingStarted = false;
let nondrivingVideoTickStarted = false;
let novelStarted = false;
let novelVideoTickStarted = false;
let lastTick = performance.now();
let cmpLastTick = performance.now();
let internalLastTick = performance.now();
let renderToken = 0;
let comparisonToken = 0;
let internalToken = 0;
let novelToken = 0;
const fullFrameQueues = new Set();
const cache = new Map();
const loaded = new Set();
const queued = new Set();
const queue = [];
let activeLoads = 0;
let selectedModels = ["difix3d", "artifixer", "onefixer"];
let internalSelectedModels = ["difix3d", "artifixer", "onefixer"];
let modelFrameEls = [];
let internalModelFrameEls = [];
let nondrivingModelFrameEls = [];
let comparisonScene = 0;
let internalScene = 0;
let nondrivingScene = 0;
const waymoFinalists = [
  "segment-207754730878135627_1140_000_1160_000_with_camera_labels",
  "segment-268278198029493143_1400_000_1420_000_with_camera_labels",
  "segment-1926967104529174124_5214_780_5234_780_with_camera_labels",
  "segment-2323851946122476774_7240_000_7260_000_with_camera_labels",
  "segment-2547899409721197155_1380_000_1400_000_with_camera_labels",
  "segment-2681180680221317256_1144_000_1164_000_with_camera_labels",
  "segment-2711351338963414257_1360_000_1380_000_with_camera_labels",
  "segment-2752216004511723012_260_000_280_000_with_camera_labels",
  "segment-2974991090366925955_4924_000_4944_000_with_camera_labels",
  "segment-3068522656378006650_540_000_560_000_with_camera_labels",
  "segment-3112630089558008159_7280_000_7300_000_with_camera_labels",
  "segment-3132521568089292927_2220_000_2240_000_with_camera_labels",
  "segment-3247914894323111613_1820_000_1840_000_with_camera_labels",
  "segment-3364861183015885008_1720_000_1740_000_with_camera_labels",
  "segment-3385534893506316900_4252_000_4272_000_with_camera_labels",
];
const comparisonScenes = waymoFinalists.map(id => ({ id, frames: 197, fps: 24 }));
const internalFinalists = [
  "left_1__ckpt_30000__ftdot_a19bee7c-87a5-570d-bd3d-24c9f1683fb1_20251030120116_103_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_5ee55fe6-479d-5a35-a384-0057cb756774_20260305023430_037_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_c3971c1c-1c0d-5c40-862b-5e8a93dd4d09_20260303051520_088_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_544f4915-7c1e-5dbd-8ae2-797cccae6f69_20260408053055_004_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_54646a0f-2b6f-5507-a6db-f9ae53296044_20251219055425_008_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_8cefce21-5eb9-51b0-954e-80f273d171d1_20260129024140_008_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_c7a15ed8-01ee-5482-b2c7-87185845eae3_20251114015322_024_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_15f0c20b-c4aa-5ee6-b84c-a84142066e4c_20251217004804_124_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_ba65f406-7748-564b-a7a9-6ac40032407b_20260119041438_024_CAM_FRONT",
  "left_1__ckpt_30000__ftdot_1d2d99b8-50f1-5a87-9416-315283d87fd7_20260427021822_017_CAM_FRONT",
];
const internalScenes = internalFinalists.map(id => ({ id, frames: 900, fps: 20 }));
const nondrivingFinalists = [
  "2f3e1c0f688c84cec67f9a1ea219c54c14ffabf31a046e620dacc690cac2f1bd",
  "8b9fb9d9f10e8c64d5034be69809465753b8ba88ef12da82afd47d38ee789934",
  "032dee9fb0a8bc1b90871dc5fe950080d0bcd3caf166447f44e60ca50ac04ec7",
];
const nondrivingScenes = nondrivingFinalists.map(id => ({ id, frames: 300, fps: 30 }));
const nondrivingModels = [
  { key: "difix3d", label: "DiFix3D" },
  { key: "artifixer", label: "ArtiFixer (1.3B)" },
  { key: "onefixer", label: "OneFixer (Ours)" },
];
const novelScenes = {
  "1_0": "000_streetsquare_cam_front_shift_1_yaw_m10",
  "1_1": "001_streetsquare_cam_front_shift_1_yaw_0",
  "1_2": "002_streetsquare_cam_front_shift_1_yaw_10",
  "2_0": "003_streetsquare_cam_front_shift_2_yaw_m10",
  "2_1": "004_streetsquare_cam_front_shift_2_yaw_0",
  "2_2": "005_streetsquare_cam_front_shift_2_yaw_10",
};
const novelSideScenes = [
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250903010737_004",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250904005550_105",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250904005550_118",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250909000822_128",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250918040339_009",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250918233353_053",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250926025105_023",
  "0098624e-722b-54f3-ac9e-2d7f25850b4f_20250926044939_007",
  "e1499ea8-ccaf-5c99-9db6-4a5935fae30a_20250912081353_082",
];
const closedLoopScenes = [
  { key: "stop_before_truck", label: "Correctly stops before the truck" },
  { key: "avoid_truck", label: "Avoid the truck correctly" },
  { key: "fast_rollout", label: "2x closed-loop rollout" },
];
const stylizationScenes = [
  "segment-2259324582958830057_3767_030_3787_030_with_camera_labels",
  "segment-1918764220984209654_5680_000_5700_000_with_camera_labels",
  "segment-1926967104529174124_5214_780_5234_780_with_camera_labels",
  "segment-1940032764689855266_3690_210_3710_210_with_camera_labels",
  "segment-3385534893506316900_4252_000_4272_000_with_camera_labels",
];
const multicamScenes = ["scene_1", "scene_2"];
const highresScenes = ["scene_1", "scene_2", "scene_3", "scene_4", "scene_5"];
const closedLoopNote = "The black dashed line indicates the logged trajectory; outside this path, no 3DGS reconstruction is available.";
let novelShift = "1";
let novelYaw = "1";
let novelGalleryScene = 0;
let novelSideShift = "left";
let closedLoopScene = 0;
let stylizationScene = 0;
let multicamScene = 0;
let highresScene = 0;
let novelPlaying = true;
let novelLastTick = performance.now();
const novelFps = 10;
const mainVideoFps = 24;

function framePath(kind, index) {
  const n = String(index + 1).padStart(3, "0");
  return `media/frame_cache_jpg_720/${kind}/${scenes[scene].id}/${n}.jpg`;
}

function mainVideoPath(kind) {
  return `media/main_videos/${kind}/${scenes[scene].id}.mp4`;
}

function comparePath(kind, index) {
  const n = String(index + 1).padStart(3, "0");
  return `media/compare_frames_small_jpg/${kind}/${comparisonScenes[comparisonScene].id}/${n}.jpg`;
}

function internalPath(kind, index) {
  const n = String(index + 1).padStart(3, "0");
  return `media/internal_compare_frames_jpg/${kind}/${internalScenes[internalScene].id}/${n}.jpg`;
}

function internalVideoPath(kind) {
  const versions = {
    artifixer: "20260923-speed-fix",
    selfforcing: "20260923-self-forcing",
  };
  const version = versions[kind] ? `?v=${versions[kind]}` : "";
  return `media/internal_videos/${kind}/${internalScenes[internalScene].id}.mp4${version}`;
}

function nondrivingVideoPath(kind) {
  return `media/nondriving_videos/${kind}/${nondrivingScenes[nondrivingScene].id}.mp4`;
}

function novelPath(index) {
  const n = String(index + 1).padStart(3, "0");
  if (novelGalleryScene > 0) {
    return `media/novel_side_composite_jpg/${novelSideScenes[novelGalleryScene - 1]}_${novelSideShift}/${n}.jpg`;
  }
  return `media/novel_composite_jpg/${novelScenes[`${novelShift}_${novelYaw}`]}/${n}.jpg`;
}

function novelVideoPath() {
  if (novelGalleryScene > 0) {
    return `media/novel_videos/${novelSideScenes[novelGalleryScene - 1]}_${novelSideShift}.mp4?v=20260923-artifixer-dmd-new`;
  }
  return `media/novel_videos/${novelScenes[`${novelShift}_${novelYaw}`]}.mp4?v=20260923-artifixer-dmd-new`;
}

function preloadAround(index) {
  enqueueMainScene();
}

function preloadComparisonAround(index) {
  enqueueComparisonScene();
}

function preloadInternalAround(index) {
  enqueueInternalScene();
}

function initWhenNear(selector, init) {
  const element = document.querySelector(selector);
  if (!element || !("IntersectionObserver" in window)) {
    init();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    init();
  }, { rootMargin: "2200px" });
  observer.observe(element);
}

function prewarmGalleries() {
  setTimeout(startComparison, 1200);
  setTimeout(startInternalComparison, 2600);
  setTimeout(startNondrivingComparison, 4000);
  setTimeout(startNovelComparison, 5200);
}

function preloadNovelAround(index) {
  enqueueNovelScene();
}

function enqueueMainScene() {
  const key = `main:${scene}`;
  if (fullFrameQueues.has(key)) return;
  fullFrameQueues.add(key);
  for (let i = 0; i < scenes[scene].frames; i++) {
    ["input", "inference"].forEach(kind => enqueue(framePath(kind, i)));
  }
}

function enqueueComparisonScene() {
  const key = `cmp:${comparisonScene}:${selectedModels.join(",")}`;
  if (fullFrameQueues.has(key)) return;
  fullFrameQueues.add(key);
  for (let i = 0; i < comparisonScenes[comparisonScene].frames; i++) {
    ["input", "gt", ...selectedModels].forEach(kind => enqueue(comparePath(kind, i)));
  }
}

function enqueueInternalScene() {
  const key = `internal:${internalScene}:${internalSelectedModels.join(",")}`;
  if (fullFrameQueues.has(key)) return;
  fullFrameQueues.add(key);
  for (let i = 0; i < internalScenes[internalScene].frames; i++) {
    ["input", "gt", ...internalSelectedModels].forEach(kind => enqueue(internalPath(kind, i)));
  }
}

function enqueueNovelScene() {
  const key = `novel:${novelGalleryScene}:${novelShift}:${novelYaw}:${novelSideShift}`;
  if (fullFrameQueues.has(key)) return;
  fullFrameQueues.add(key);
  for (let i = 0; i < 300; i++) enqueue(novelPath(i));
}


function load(src) {
  if (!cache.has(src)) {
    cache.set(src, new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        loaded.add(src);
        updateLoadedBars();
        resolve(img);
      };
      img.onerror = () => {
        cache.delete(src);
        updateLoadedBars();
        resolve(img);
      };
      img.src = src;
    }));
  }
  return cache.get(src);
}

function enqueue(src) {
  if (cache.has(src) || queued.has(src)) return;
  queued.add(src);
  queue.push(src);
  pumpQueue();
}

function mainFrameSources(index) {
  return [framePath("input", index), framePath("inference", index)];
}

function mainFrameReady(index) {
  return mainFrameSources(index).every(src => loaded.has(src));
}

function sourcesReady(sources) {
  return sources.every(src => loaded.has(src));
}

function requestSources(sources) {
  sources.forEach(src => load(src));
}

function comparisonSources(index) {
  return [comparePath("input", index), comparePath("gt", index), ...selectedModels.map(key => comparePath(key, index))];
}

function internalSources(index) {
  return [internalPath("input", index), internalPath("gt", index), ...internalSelectedModels.map(key => internalPath(key, index))];
}

function advanceIfReady(current, total, setNext, sourcesForFrame) {
  const next = (current + 1) % total;
  const sources = sourcesForFrame(next);
  if (!sourcesReady(sources)) {
    requestSources(sources);
    return false;
  }
  setNext(next);
  return true;
}

function pumpQueue() {
  while (activeLoads < 24 && queue.length) {
    activeLoads++;
    const src = queue.shift();
    load(src).finally(() => {
      queued.delete(src);
      activeLoads--;
      pumpQueue();
    });
  }
}

function preloadAllFrames() {
  for (let s = 0; s < scenes.length; s++) {
    const oldScene = scene;
    scene = s;
    for (let i = 0; i < scenes[s].frames; i++) {
      ["input", "inference"].forEach(kind => enqueue(framePath(kind, i)));
    }
    scene = oldScene;
  }
  for (let s = 0; s < comparisonScenes.length; s++) {
    comparisonScene = s;
    for (let i = 0; i < comparisonScenes[s].frames; i++) {
      ["input", "gt", ...models.map(model => model.key)].forEach(kind => enqueue(comparePath(kind, i)));
    }
  }
  comparisonScene = 0;
  for (let s = 0; s < internalScenes.length; s++) {
    internalScene = s;
    for (let i = 0; i < internalScenes[s].frames; i++) {
      ["input", "gt", ...models.map(model => model.key)].forEach(kind => enqueue(internalPath(kind, i)));
    }
  }
  internalScene = 0;
}

function loadedThrough(kinds, pathFn, totalFrames = scenes[scene].frames) {
  let index = 0;
  while (index < totalFrames && kinds.every(kind => loaded.has(pathFn(kind, index)))) index++;
  return index;
}

function updateLoadedBars() {
  const total = scenes[scene].frames;
  const cmpTotal = comparisonScenes[comparisonScene].frames;
  const internalTotal = internalScenes[internalScene].frames;
  const mainLoaded = loadedThrough(["input", "inference"], framePath);
  const cmpLoaded = loadedThrough(["input", "gt", ...selectedModels], comparePath, comparisonScenes[comparisonScene].frames);
  mainScrubber.style.setProperty("--loaded", `${(Math.max(mainLoaded, frame) / total) * 100}%`);
  cmpScrubber.style.setProperty("--loaded", `${(Math.max(cmpLoaded, cmpFrame) / cmpTotal) * 100}%`);
  mainLoadedLabel.textContent = `Loaded ${mainLoaded} / ${total}`;
  cmpLoadedLabel.textContent = `Loaded ${cmpLoaded} / ${cmpTotal}`;
  mainScrubber.classList.toggle("loading", mainLoaded < total);
  cmpScrubber.classList.toggle("loading", cmpLoaded < cmpTotal);
  mainLoadedLabel.classList.toggle("loading", mainLoaded < total);
  cmpLoadedLabel.classList.toggle("loading", cmpLoaded < cmpTotal);
  if (internalInput.tagName !== "VIDEO") {
    const internalLoaded = loadedThrough(["input", "gt", ...internalSelectedModels], internalPath, internalTotal);
    internalScrubber.style.setProperty("--loaded", `${(Math.max(internalLoaded, internalFrame) / internalTotal) * 100}%`);
    internalLoadedLabel.textContent = `Loaded ${internalLoaded} / ${internalTotal}`;
    internalScrubber.classList.toggle("loading", internalLoaded < internalTotal);
    internalLoadedLabel.classList.toggle("loading", internalLoaded < internalTotal);
  }
}

function render() {
  const token = ++renderToken;
  const input = framePath("input", frame);
  const output = framePath("inference", frame);
  timeline.value = frame;
  mainScrubber.style.setProperty("--played", `${(frame / (scenes[scene].frames - 1)) * 100}%`);
  frameLabel.textContent = `Frame ${frame} / ${scenes[scene].frames - 1}`;
  showLoader(mainFrameLoader, mainAutoplayPending || !loaded.has(input) || !loaded.has(output));
  Promise.all([load(input), load(output)]).then(images => {
    if (token !== renderToken) return;
    inputFrame.src = input;
    outputFrame.src = output;
    showLoader(mainFrameLoader, mainAutoplayPending);
  });
  preloadAround(frame);
}

function primeMainPlayback() {
  const token = ++mainStartupToken;
  mainAutoplayPending = true;
  playing = false;
  playButton.textContent = "Pause";
  showLoader(mainFrameLoader, true);
  inputFrame.src = mainVideoPath("input");
  outputFrame.src = mainVideoPath("inference");
  inputFrame.load();
  outputFrame.load();
  return Promise.all([
    new Promise(resolve => inputFrame.addEventListener("canplay", resolve, { once: true })),
    new Promise(resolve => outputFrame.addEventListener("canplay", resolve, { once: true })),
  ]).then(() => {
    if (token !== mainStartupToken) return;
    mainAutoplayPending = false;
    inputFrame.currentTime = 0;
    outputFrame.currentTime = 0;
    showLoader(mainFrameLoader, false);
    playing = true;
    inputFrame.play().catch(() => {});
    outputFrame.play().catch(() => {});
    playButton.textContent = "Pause";
    lastTick = performance.now();
    updateMainVideoState();
  });
}

function renderComparison() {
  const token = ++comparisonToken;
  const modelImages = selectedModels.map(key => [key, comparePath(key, cmpFrame)]);
  cmpTimeline.value = cmpFrame;
  cmpScrubber.style.setProperty("--played", `${(cmpFrame / (comparisonScenes[comparisonScene].frames - 1)) * 100}%`);
  cmpFrameLabel.textContent = `Frame ${cmpFrame} / ${comparisonScenes[comparisonScene].frames - 1}`;
  Promise.all([load(comparePath("input", cmpFrame)), load(comparePath("gt", cmpFrame)), ...modelImages.map(([, src]) => load(src))]).then(images => {
    if (token !== comparisonToken) return;
    cmpInput.src = images[0].src;
    cmpGt.src = images[1].src;
    modelFrameEls.forEach((img, i) => img.src = images[i + 2].src);
  });
  preloadComparisonAround(cmpFrame);
}

function renderInternalComparison() {
  if (internalInput.tagName === "VIDEO") {
    setInternalVideoSources();
    return;
  }
  const token = ++internalToken;
  const modelImages = internalSelectedModels.map(key => [key, internalPath(key, internalFrame)]);
  internalTimeline.value = internalFrame;
  internalScrubber.style.setProperty("--played", `${(internalFrame / (internalScenes[internalScene].frames - 1)) * 100}%`);
  internalFrameLabel.textContent = `Frame ${internalFrame} / ${internalScenes[internalScene].frames - 1}`;
  Promise.all([load(internalPath("input", internalFrame)), load(internalPath("gt", internalFrame)), ...modelImages.map(([, src]) => load(src))]).then(images => {
    if (token !== internalToken) return;
    internalInput.src = images[0].src;
    internalGt.src = images[1].src;
    internalModelFrameEls.forEach((img, i) => img.src = images[i + 2].src);
  });
  preloadInternalAround(internalFrame);
}

function renderNondrivingComparison() {
  setNondrivingVideoSources();
}

function internalVideos() {
  return [internalInput, internalGt, ...internalModelFrameEls];
}

function nondrivingVideos() {
  return [nondrivingInput, nondrivingGt, ...nondrivingModelFrameEls];
}

function bindInternalVideo(video) {
  if (video.dataset.internalBound) return;
  video.dataset.internalBound = "true";
  ["loadedmetadata", "progress", "timeupdate", "waiting", "playing", "pause"].forEach(eventName => {
    video.addEventListener(eventName, updateInternalVideoState);
  });
}

function bindNondrivingVideo(video) {
  if (video.dataset.nondrivingBound) return;
  video.dataset.nondrivingBound = "true";
  ["loadedmetadata", "progress", "timeupdate", "waiting", "playing", "pause"].forEach(eventName => {
    video.addEventListener(eventName, updateNondrivingVideoState);
  });
}

function setInternalVideoSources() {
  const leaderTime = internalInput.currentTime || 0;
  const shouldPlay = internalPlaying;
  const entries = [
    ["input", internalInput],
    ["gt", internalGt],
    ...internalSelectedModels.map((key, i) => [key, internalModelFrameEls[i]]),
  ];
  entries.forEach(([kind, video]) => {
    if (!video) return;
    bindInternalVideo(video);
    video.loop = true;
    const src = internalVideoPath(kind);
    if (!video.src.endsWith(src)) {
      video.src = src;
      video.load();
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = Math.min(leaderTime, video.duration || leaderTime);
        if (shouldPlay) video.play().catch(() => {});
      }, { once: true });
    }
    video.playbackRate = 1;
  });
  if (shouldPlay) internalVideos().forEach(video => video.play().catch(() => {}));
  updateInternalVideoState();
}

function setNondrivingVideoSources() {
  const entries = [
    ["input", nondrivingInput],
    ["gt", nondrivingGt],
    ...nondrivingModels.map((model, i) => [model.key, nondrivingModelFrameEls[i]]),
  ];
  entries.forEach(([kind, video]) => {
    if (!video) return;
    bindNondrivingVideo(video);
    video.loop = true;
    const src = nondrivingVideoPath(kind);
    if (!video.src.endsWith(src)) {
      video.src = src;
      video.load();
    }
    video.playbackRate = 1;
  });
  if (nondrivingPlaying) nondrivingVideos().forEach(video => video.play().catch(() => {}));
  updateNondrivingVideoState();
}

function updateInternalVideoState() {
  if (internalInput.tagName !== "VIDEO") return;
  const videos = internalVideos().filter(Boolean);
  if (!videos.length) return;
  const leader = internalInput;
  const total = internalScenes[internalScene].frames;
  internalFrame = Math.min(total - 1, Math.round((leader.currentTime || 0) * internalScenes[internalScene].fps));
  internalTimeline.value = internalFrame;
  const playedPct = total > 1 ? (internalFrame / (total - 1)) * 100 : 0;
  const loadedPct = Math.min(...videos.map(bufferedPercent));
  internalScrubber.style.setProperty("--played", `${playedPct}%`);
  internalScrubber.style.setProperty("--loaded", `${Math.max(loadedPct, playedPct)}%`);
  internalFrameLabel.textContent = `Frame ${internalFrame} / ${total - 1}`;
  internalLoadedLabel.textContent = `Loaded ${Math.round((loadedPct / 100) * total)} / ${total}`;
  internalScrubber.classList.toggle("loading", loadedPct < 100);
  internalLoadedLabel.classList.toggle("loading", loadedPct < 100);
  internalPlayButton.textContent = leader.paused ? "Play" : "Pause";
  videos.slice(1).forEach(video => {
    if (Math.abs(video.currentTime - leader.currentTime) > 0.08) video.currentTime = leader.currentTime;
    if (leader.paused || leader.ended) {
      if (!video.paused) video.pause();
    } else if (video.paused) {
      video.play().catch(() => {});
    }
  });
}

function updateNondrivingVideoState() {
  const videos = nondrivingVideos().filter(Boolean);
  if (!videos.length) return;
  const leader = nondrivingInput;
  const total = nondrivingScenes[nondrivingScene].frames;
  nondrivingFrame = Math.min(total - 1, Math.round((leader.currentTime || 0) * nondrivingScenes[nondrivingScene].fps));
  nondrivingTimeline.value = nondrivingFrame;
  const playedPct = total > 1 ? (nondrivingFrame / (total - 1)) * 100 : 0;
  const loadedPct = Math.min(...videos.map(bufferedPercent));
  nondrivingScrubber.style.setProperty("--played", `${playedPct}%`);
  nondrivingScrubber.style.setProperty("--loaded", `${Math.max(loadedPct, playedPct)}%`);
  nondrivingFrameLabel.textContent = `Frame ${nondrivingFrame} / ${total - 1}`;
  nondrivingLoadedLabel.textContent = `Loaded ${Math.round((loadedPct / 100) * total)} / ${total}`;
  nondrivingScrubber.classList.toggle("loading", loadedPct < 100);
  nondrivingLoadedLabel.classList.toggle("loading", loadedPct < 100);
  nondrivingPlayButton.textContent = leader.paused ? "Play" : "Pause";
  videos.slice(1).forEach(video => {
    if (Math.abs(video.currentTime - leader.currentTime) > 0.08) video.currentTime = leader.currentTime;
    if (leader.paused || leader.ended) {
      if (!video.paused) video.pause();
    } else if (video.paused) {
      video.play().catch(() => {});
    }
  });
}

function internalVideoTick() {
  updateInternalVideoState();
  requestAnimationFrame(internalVideoTick);
}

function nondrivingVideoTick() {
  updateNondrivingVideoState();
  requestAnimationFrame(nondrivingVideoTick);
}

function setFrame(next) {
  frame = Math.max(0, Math.min(scenes[scene].frames - 1, next));
  render();
}

function seekFrame(next) {
  mainStartupToken++;
  mainAutoplayPending = false;
  setFrame(next);
}

function setComparisonFrame(next) {
  cmpFrame = Math.max(0, Math.min(comparisonScenes[comparisonScene].frames - 1, next));
  renderComparison();
}

function setInternalFrame(next) {
  internalFrame = Math.max(0, Math.min(internalScenes[internalScene].frames - 1, next));
  if (internalInput.tagName === "VIDEO") {
    const time = internalFrame / internalScenes[internalScene].fps;
    internalVideos().forEach(video => {
      if (Number.isFinite(video.duration)) video.currentTime = Math.min(time, video.duration || time);
      else video.currentTime = time;
    });
    updateInternalVideoState();
    return;
  }
  renderInternalComparison();
}

function setNondrivingFrame(next) {
  nondrivingFrame = Math.max(0, Math.min(nondrivingScenes[nondrivingScene].frames - 1, next));
  const time = nondrivingFrame / nondrivingScenes[nondrivingScene].fps;
  nondrivingVideos().forEach(video => {
    if (Number.isFinite(video.duration)) video.currentTime = Math.min(time, video.duration || time);
    else video.currentTime = time;
  });
  updateNondrivingVideoState();
}

function setScene(next) {
  mainStartupToken++;
  mainAutoplayPending = true;
  playing = false;
  playButton.textContent = "Pause";
  scene = (next + scenes.length) % scenes.length;
  frame = 0;
  timeline.max = scenes[scene].frames - 1;
  sceneButtons.forEach((button, i) => button.classList.toggle("active", i === scene));
  timeline.value = 0;
  mainScrubber.style.setProperty("--played", "0%");
  frameLabel.textContent = `Frame 0 / ${scenes[scene].frames - 1}`;
  showLoader(mainFrameLoader, true);
  return primeMainPlayback();
}

function renderModelPicker() {
  modelPicker.innerHTML = ["Image model", "Bidirectional model", "Causal model"].map(group => {
    const buttons = models.filter(model => model.group === group).map(model => {
      const active = selectedModels.includes(model.key) ? " active" : "";
      const disabled = model.locked ? " disabled" : "";
      const locked = model.locked ? " locked" : "";
      return `<button type="button" data-model="${model.key}" class="${(active + locked).trim()}"${disabled}>${model.label}</button>`;
    }).join("");
    return `<div class="model-group"><span>${group}</span>${buttons}</div>`;
  }).join("");
  renderModelTiles();
}

function renderModelTiles() {
  modelGrid.innerHTML = selectedModels.map(key => {
    const model = models.find(item => item.key === key);
    return `<figure><img alt=""><figcaption>${model.label}</figcaption></figure>`;
  }).join("");
  modelFrameEls = [...modelGrid.querySelectorAll("img")];
}

function renderInternalModelPicker() {
  internalModelPicker.innerHTML = ["Image model", "Bidirectional model", "Causal model"].map(group => {
    const buttons = internalModels.filter(model => model.group === group).map(model => {
      const active = internalSelectedModels.includes(model.key) ? " active" : "";
      const disabled = model.locked ? " disabled" : "";
      const locked = model.locked ? " locked" : "";
      return `<button type="button" data-internal-model="${model.key}" class="${(active + locked).trim()}"${disabled}>${model.label}</button>`;
    }).join("");
    return `<div class="model-group"><span>${group}</span>${buttons}</div>`;
  }).join("");
  renderInternalModelTiles();
}

function renderInternalModelTiles() {
  internalModelGrid.innerHTML = internalSelectedModels.map(key => {
    const model = internalModels.find(item => item.key === key);
    return `<figure><video muted loop playsinline preload="auto"></video><figcaption>${model.label}</figcaption></figure>`;
  }).join("");
  internalModelFrameEls = [...internalModelGrid.querySelectorAll("video")];
}

function renderNondrivingModelTiles() {
  nondrivingModelGrid.innerHTML = nondrivingModels.map(model => (
    `<figure><video muted loop playsinline preload="auto"></video><figcaption>${model.label}</figcaption></figure>`
  )).join("");
  nondrivingModelFrameEls = [...nondrivingModelGrid.querySelectorAll("video")];
}

function renderWaymoThumbs() {
  waymoThumbs.innerHTML = waymoFinalists.map((id, i) => {
    const active = i === comparisonScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-comparison-scene="${i}" aria-label="Waymo comparison ${i + 1}"><img src="media/waymo_input_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderInternalThumbs() {
  internalThumbs.innerHTML = internalFinalists.map((id, i) => {
    const active = i === internalScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-internal-scene="${i}" aria-label="Internal comparison ${i + 1}"><img src="media/internal_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderNondrivingThumbs() {
  nondrivingThumbs.innerHTML = nondrivingFinalists.map((id, i) => {
    const active = i === nondrivingScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-nondriving-scene="${i}" aria-label="Non-driving comparison ${i + 1}"><img src="media/nondriving_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderNovelSelectors() {
  if (novelGalleryScene === 0) {
    novelSelectors.innerHTML = `
      <div class="model-group">
        <span>Displacement</span>
        <button type="button" class="${novelShift === "1" ? "active" : ""}" data-shift="1">+1m from Logging view</button>
        <button type="button" class="${novelShift === "2" ? "active" : ""}" data-shift="2">+2m from Logging view</button>
      </div>
      <div class="model-group">
        <span>Yaw</span>
        <button type="button" class="${novelYaw === "0" ? "active" : ""}" data-yaw="0">Left 10 deg</button>
        <button type="button" class="${novelYaw === "1" ? "active" : ""}" data-yaw="1">0 deg</button>
        <button type="button" class="${novelYaw === "2" ? "active" : ""}" data-yaw="2">Right 10 deg</button>
      </div>`;
    return;
  }
  novelSelectors.innerHTML = `
    <div class="model-group">
      <span>Displacement</span>
      <button type="button" class="${novelSideShift === "left" ? "active" : ""}" data-side-shift="left">Left 2m from Logging view</button>
      <button type="button" class="${novelSideShift === "right" ? "active" : ""}" data-side-shift="right">Right 2m from Logging view</button>
    </div>`;
}

function renderNovelThumbs() {
  const firstActive = novelGalleryScene === 0 ? " active" : "";
  const first = `<button type="button" class="${firstActive.trim()}" data-novel-scene="0" aria-label="Novel view streetsquare"><img src="media/novel_thumbs/streetsquare.jpg" alt="" loading="lazy" decoding="async"></button>`;
  const rest = novelSideScenes.map((id, i) => {
    const sceneIndex = i + 1;
    const active = sceneIndex === novelGalleryScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-novel-scene="${sceneIndex}" aria-label="Novel side comparison ${sceneIndex}"><img src="media/novel_side_thumbs/${id}_${novelSideShift}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
  novelThumbs.innerHTML = first + rest;
}

function renderClosedLoopThumbs() {
  closedLoopThumbs.innerHTML = closedLoopScenes.map((item, i) => {
    const active = i === closedLoopScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-closed-loop-scene="${i}" aria-label="${item.label}"><img src="media/closed_loop_thumbs/${item.key}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderStylizationThumbs() {
  stylizationThumbs.innerHTML = stylizationScenes.map((id, i) => {
    const active = i === stylizationScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-stylization-scene="${i}" aria-label="Stylization scene ${i + 1}"><img src="media/stylization_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderMulticamThumbs() {
  multicamThumbs.innerHTML = multicamScenes.map((id, i) => {
    const active = i === multicamScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-multicam-scene="${i}" aria-label="Multi-camera scene ${i + 1}"><img src="media/multicam_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function renderHighresThumbs() {
  highresThumbs.innerHTML = highresScenes.map((id, i) => {
    const active = i === highresScene ? " active" : "";
    return `<button type="button" class="${active.trim()}" data-highres-scene="${i}" aria-label="High-resolution scene ${i + 1}"><img src="media/high_resolution_thumbs/${id}.jpg" alt="" loading="lazy" decoding="async"></button>`;
  }).join("");
}

function setComparisonScene(next) {
  comparisonScene = next;
  cmpFrame = 0;
  cmpTimeline.max = comparisonScenes[comparisonScene].frames - 1;
  renderWaymoThumbs();
  updateLoadedBars();
  renderComparison();
}

function setInternalScene(next) {
  internalScene = next;
  internalFrame = 0;
  internalTimeline.max = internalScenes[internalScene].frames - 1;
  renderInternalThumbs();
  updateLoadedBars();
  renderInternalComparison();
}

function setNondrivingScene(next) {
  nondrivingScene = next;
  nondrivingFrame = 0;
  nondrivingTimeline.max = nondrivingScenes[nondrivingScene].frames - 1;
  renderNondrivingThumbs();
  renderNondrivingComparison();
}

function toggleModel(key) {
  if (key === "onefixer") return;
  if (selectedModels.includes(key)) {
    selectedModels = selectedModels.filter(item => item === "onefixer" || item !== key);
  } else {
    const extras = selectedModels.filter(item => item !== "onefixer");
    selectedModels = [...extras.slice(-1), key, "onefixer"];
  }
  renderModelPicker();
  renderComparison();
}

function toggleInternalModel(key) {
  if (key === "onefixer") return;
  if (!internalModelKeys.has(key)) return;
  internalPlaying = internalInput.paused ? internalPlaying : true;
  if (internalSelectedModels.includes(key)) {
    internalSelectedModels = internalSelectedModels.filter(item => item === "onefixer" || item !== key);
  } else {
    const extras = internalSelectedModels.filter(item => item !== "onefixer");
    internalSelectedModels = [...extras.slice(-1), key, "onefixer"];
  }
  renderInternalModelPicker();
  renderInternalComparison();
}

function updateMainVideoState() {
  const duration = inputFrame.duration || outputFrame.duration || 0;
  const current = inputFrame.currentTime || 0;
  frame = Math.min(scenes[scene].frames - 1, Math.round(current * mainVideoFps));
  timeline.value = frame;
  const playedPct = scenes[scene].frames > 1 ? (frame / (scenes[scene].frames - 1)) * 100 : 0;
  mainScrubber.style.setProperty("--played", `${playedPct}%`);
  mainScrubber.style.setProperty("--loaded", `${Math.max(bufferedPercent(inputFrame), playedPct)}%`);
  frameLabel.textContent = `Frame ${frame} / ${scenes[scene].frames - 1}`;
  mainLoadedLabel.textContent = `Loaded ${Math.round((bufferedPercent(inputFrame) / 100) * scenes[scene].frames)} / ${scenes[scene].frames}`;
  mainFrameLoader.classList.toggle("active", inputFrame.readyState < 3 || outputFrame.readyState < 3);
  playButton.textContent = inputFrame.paused ? "Play" : "Pause";
  if (Math.abs(outputFrame.currentTime - current) > 0.08) outputFrame.currentTime = current;
  if (!inputFrame.paused && outputFrame.paused) outputFrame.play().catch(() => {});
}

function tick(now) {
  updateMainVideoState();
  requestAnimationFrame(tick);
}

function comparisonTick(now) {
  if (cmpPlaying) {
    const stepMs = 1000 / comparisonScenes[comparisonScene].fps;
    const steps = Math.floor((now - cmpLastTick) / stepMs);
    if (steps > 0) {
      advanceIfReady(cmpFrame, comparisonScenes[comparisonScene].frames, setComparisonFrame, comparisonSources);
      cmpLastTick = now;
    }
  } else {
    cmpLastTick = now;
  }
  requestAnimationFrame(comparisonTick);
}

function internalTick(now) {
  if (internalPlaying) {
    const stepMs = 1000 / internalScenes[internalScene].fps;
    const steps = Math.floor((now - internalLastTick) / stepMs);
    if (steps > 0) {
      advanceIfReady(internalFrame, internalScenes[internalScene].frames, setInternalFrame, internalSources);
      internalLastTick = now;
    }
  } else {
    internalLastTick = now;
  }
  requestAnimationFrame(internalTick);
}

function novelTick(now) {
  if (novelPlaying) {
    const stepMs = 1000 / novelFps;
    const steps = Math.floor((now - novelLastTick) / stepMs);
    if (steps > 0) {
      advanceIfReady(novelFrame, 300, setNovelFrame, index => [novelPath(index)]);
      novelLastTick = now;
    }
  } else {
    novelLastTick = now;
  }
  requestAnimationFrame(novelTick);
}

function updateNovelVideoState() {
  const total = 300;
  const current = novelComposite.currentTime || 0;
  novelFrame = Math.min(total - 1, Math.round(current * novelFps));
  novelTimeline.value = novelFrame;
  const playedPct = total > 1 ? (novelFrame / (total - 1)) * 100 : 0;
  const loadedPct = bufferedPercent(novelComposite);
  const scrubber = novelTimeline.closest(".scrubber");
  scrubber?.style.setProperty("--played", `${playedPct}%`);
  scrubber?.style.setProperty("--loaded", `${Math.max(loadedPct, playedPct)}%`);
  novelFrameLabel.textContent = `Frame ${novelFrame} / 299`;
  novelPlayButton.textContent = novelComposite.paused ? "Play" : "Pause";
}

function novelVideoTick() {
  updateNovelVideoState();
  requestAnimationFrame(novelVideoTick);
}


function syncMotivationVideos() {
  if (motivationVideos.length) {
    const leader = motivationVideos[0];
    if (leader.currentTime * motivationFps < motivationStartFrame - 1) leader.currentTime = motivationStartFrame / motivationFps;
    const nextFrame = Math.round(leader.currentTime * motivationFps);
    motivationTimeline.value = Math.min(nextFrame, motivationFrames);
    motivationScrubber.style.setProperty("--played", `${(Number(motivationTimeline.value) / motivationFrames) * 100}%`);
    motivationFrameLabel.textContent = `Frame ${motivationTimeline.value} / ${motivationFrames}`;
    motivationVideos.slice(1).forEach(video => {
      if (Math.abs(video.currentTime - leader.currentTime) > 0.08) video.currentTime = leader.currentTime;
      if (motivationPlaying && video.paused) video.play().catch(() => {});
    });
    updateMotivationLoadState();
  }
  requestAnimationFrame(syncMotivationVideos);
}

function setMotivationPlaying(next) {
  motivationPlaying = next;
  motivationPlayButton.textContent = motivationPlaying ? "Pause" : "Play";
  motivationVideos.forEach(video => motivationPlaying ? video.play().catch(() => {}) : video.pause());
}

function updateMotivationLoadState() {
  const video = motivationVideos[0];
  if (!video) return;
  const duration = video.duration || 0;
  let loadedEnd = 0;
  for (let i = 0; i < video.buffered.length; i++) {
    loadedEnd = Math.max(loadedEnd, video.buffered.end(i));
  }
  const nativePct = duration ? Math.min(100, (loadedEnd / duration) * 100) : 0;
  const loadedPct = Math.max(nativePct, motivationFetchProgress);
  const loadedFrames = Math.min(motivationFrames, Math.round((loadedPct / 100) * motivationFrames));
  const loading = loadedPct < 100 && video.readyState < 4;
  const playedPct = motivationFrames ? (Number(motivationTimeline.value) / motivationFrames) * 100 : 0;
  motivationScrubber.style.setProperty("--loaded", `${Math.max(loadedPct, playedPct)}%`);
  motivationLoadedLabel.textContent = `Loaded ${loadedFrames} / ${motivationFrames}`;
  motivationScrubber.classList.toggle("loading", loading);
  motivationLoadedLabel.classList.toggle("loading", loading);
  motivationLoader.classList.toggle("active", loading || video.readyState < 3);
}

async function preloadMotivationVideo() {
  const video = motivationVideos[0];
  const src = video?.dataset.src;
  if (!video || !src) return;
  showLoader(motivationLoader, true);
  try {
    const response = await fetch(src, { cache: "force-cache" });
    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    if (!response.ok || !reader) throw new Error("Motivation fetch failed");
    const chunks = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total) {
        motivationFetchProgress = Math.min(99, (received / total) * 100);
        updateMotivationLoadState();
      }
    }
    motivationFetchProgress = 100;
    video.src = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
    video.load();
  } catch {
    video.src = src;
    video.load();
  }
}

function renderNovel() {
  novelFigure.classList.toggle("novel-side-composite", novelGalleryScene > 0);
  const src = novelVideoPath();
  if (!novelComposite.src.endsWith(src)) {
    novelComposite.src = src;
    novelComposite.load();
  }
  novelComposite.loop = true;
  if (novelPlaying) novelComposite.play().catch(() => {});
  updateNovelVideoState();
}

function setNovelFrame(next) {
  novelFrame = Math.max(0, Math.min(299, next));
  novelComposite.currentTime = novelFrame / novelFps;
  updateNovelVideoState();
}

function setNovelScene() {
  novelFrame = 0;
  renderNovelSelectors();
  renderNovelThumbs();
  renderNovel();
  novelComposite.currentTime = 0;
  updateNovelVideoState();
}

function startComparison() {
  if (comparisonStarted) return;
  comparisonStarted = true;
  setComparisonScene(0);
  cmpLastTick = performance.now();
  requestAnimationFrame(comparisonTick);
}

function startInternalComparison() {
  if (internalStarted) return;
  internalStarted = true;
  setInternalScene(0);
  internalLastTick = performance.now();
  if (internalInput.tagName === "VIDEO") {
    if (!internalVideoTickStarted) {
      internalVideoTickStarted = true;
      requestAnimationFrame(internalVideoTick);
    }
  } else {
    requestAnimationFrame(internalTick);
  }
}

function startNondrivingComparison() {
  if (nondrivingStarted) return;
  nondrivingStarted = true;
  renderNondrivingModelTiles();
  setNondrivingScene(0);
  if (!nondrivingVideoTickStarted) {
    nondrivingVideoTickStarted = true;
    requestAnimationFrame(nondrivingVideoTick);
  }
}

function startNovelComparison() {
  if (novelStarted) return;
  novelStarted = true;
  setNovelScene();
  novelLastTick = performance.now();
  if (!novelVideoTickStarted) {
    novelVideoTickStarted = true;
    requestAnimationFrame(novelVideoTick);
  }
}

function setClosedLoopScene(next) {
  closedLoopScene = next;
  const item = closedLoopScenes[closedLoopScene];
  showLoader(closedLoopLoader, true);
  closedLoopVideo.src = `media/closed_loop/${item.key}.mp4`;
  closedLoopCaption.textContent = `${item.label}. ${closedLoopNote}`;
  renderClosedLoopThumbs();
  closedLoopVideo.play().catch(() => {});
}

function setStylizationScene(next) {
  stylizationScene = next;
  const id = stylizationScenes[stylizationScene];
  stylizationVideos.forEach(video => {
    video.src = `media/stylization_cells/${video.dataset.styleVideo}/${id}.mp4`;
  });
  renderStylizationThumbs();
  stylizationVideos.forEach(video => video.play().catch(() => {}));
}

function setMulticamScene(next) {
  multicamScene = next;
  showLoader(multicamLoader, true);
  multicamVideo.src = `media/multicam/${multicamScenes[multicamScene]}.mp4`;
  renderMulticamThumbs();
  multicamVideo.play().catch(() => {});
}

function setHighresScene(next) {
  highresScene = next;
  showLoader(highresLoader, true);
  highresImage.src = `media/high_resolution/${highresScenes[highresScene]}.png`;
  renderHighresThumbs();
}

function showLoader(loader, active) {
  loader?.classList.toggle("active", active);
}

function bindLoadingIndicator(media, loader) {
  if (!media || !loader) return;
  ["loadstart", "waiting", "stalled"].forEach(eventName => {
    media.addEventListener(eventName, () => showLoader(loader, true));
  });
  ["canplay", "playing", "loadeddata", "load"].forEach(eventName => {
    media.addEventListener(eventName, () => showLoader(loader, false));
  });
  if (media.tagName === "IMG" && media.complete) showLoader(loader, false);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

const backgroundVideoLoads = new Set();

function keepLoadingVideo(video) {
  const src = video.currentSrc || video.src;
  if (!src || src.startsWith("blob:") || backgroundVideoLoads.has(src)) return;
  backgroundVideoLoads.add(src);
  fetch(src, { cache: "force-cache" }).catch(() => {});
}

function bufferedPercent(video) {
  if (!video.duration) return 0;
  let end = 0;
  for (let i = 0; i < video.buffered.length; i++) end = Math.max(end, video.buffered.end(i));
  return Math.min(100, (end / video.duration) * 100);
}

function bindMediaControls(video, playButton, timelineInput, timeLabel) {
  const scrubber = timelineInput.closest(".scrubber");
  const update = () => {
    const duration = video.duration || 0;
    timelineInput.value = duration ? Math.round((video.currentTime / duration) * 1000) : 0;
    const playedPct = Number(timelineInput.value) / 10;
    scrubber?.style.setProperty("--played", `${playedPct}%`);
    scrubber?.style.setProperty("--loaded", `${Math.max(bufferedPercent(video), playedPct)}%`);
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
    playButton.textContent = video.paused ? "Play" : "Pause";
  };
  playButton.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  const seek = () => {
    if (video.duration) video.currentTime = (Number(timelineInput.value) / 1000) * video.duration;
    update();
  };
  timelineInput.addEventListener("input", seek);
  timelineInput.addEventListener("change", seek);
  video.addEventListener("timeupdate", update);
  video.addEventListener("loadedmetadata", update);
  video.addEventListener("progress", update);
  video.addEventListener("play", update);
  video.addEventListener("play", () => keepLoadingVideo(video), { once: true });
  video.addEventListener("pause", update);
}

function bindMediaGroupControls(videos, playButton, timelineInput, timeLabel) {
  const leader = videos[0];
  const scrubber = timelineInput.closest(".scrubber");
  const update = () => {
    const duration = leader.duration || 0;
    timelineInput.value = duration ? Math.round((leader.currentTime / duration) * 1000) : 0;
    const playedPct = Number(timelineInput.value) / 10;
    scrubber?.style.setProperty("--played", `${playedPct}%`);
    scrubber?.style.setProperty("--loaded", `${Math.max(bufferedPercent(leader), playedPct)}%`);
    timeLabel.textContent = `${formatTime(leader.currentTime)} / ${formatTime(duration)}`;
    playButton.textContent = leader.paused ? "Play" : "Pause";
    videos.slice(1).forEach(video => {
      if (Math.abs(video.currentTime - leader.currentTime) > 0.08) video.currentTime = leader.currentTime;
      if (!leader.paused && video.paused) video.play().catch(() => {});
    });
  };
  playButton.addEventListener("click", () => {
    if (leader.paused) videos.forEach(video => video.play().catch(() => {}));
    else videos.forEach(video => video.pause());
  });
  timelineInput.addEventListener("input", () => {
    if (leader.duration) {
      const time = (Number(timelineInput.value) / 1000) * leader.duration;
      videos.forEach(video => video.currentTime = time);
    }
  });
  leader.addEventListener("timeupdate", update);
  leader.addEventListener("loadedmetadata", update);
  leader.addEventListener("progress", update);
  leader.addEventListener("play", update);
  leader.addEventListener("play", () => videos.forEach(keepLoadingVideo), { once: true });
  leader.addEventListener("pause", update);
}

split.addEventListener("input", () => compare.style.setProperty("--split", `${split.value}%`));
["loadedmetadata", "canplay", "playing", "waiting", "progress", "timeupdate", "pause"].forEach(eventName => {
  inputFrame.addEventListener(eventName, updateMainVideoState);
  outputFrame.addEventListener(eventName, updateMainVideoState);
});
playButton.addEventListener("click", () => {
  if (inputFrame.paused) {
    inputFrame.play().catch(() => {});
    outputFrame.play().catch(() => {});
  } else {
    inputFrame.pause();
    outputFrame.pause();
  }
  updateMainVideoState();
});
timeline.addEventListener("input", () => {
  const time = Number(timeline.value) / mainVideoFps;
  inputFrame.currentTime = time;
  outputFrame.currentTime = time;
  updateMainVideoState();
});
cmpPlayButton.addEventListener("click", () => {
  startComparison();
  cmpPlaying = !cmpPlaying;
  cmpPlayButton.textContent = cmpPlaying ? "Pause" : "Play";
});
internalPlayButton.addEventListener("click", () => {
  startInternalComparison();
  if (internalInput.tagName === "VIDEO") {
    const shouldPlay = internalInput.paused;
    internalPlaying = shouldPlay;
    internalVideos().forEach(video => shouldPlay ? video.play().catch(() => {}) : video.pause());
    updateInternalVideoState();
  } else {
    internalPlaying = !internalPlaying;
    internalPlayButton.textContent = internalPlaying ? "Pause" : "Play";
  }
});
nondrivingPlayButton.addEventListener("click", () => {
  startNondrivingComparison();
  const shouldPlay = nondrivingInput.paused;
  nondrivingPlaying = shouldPlay;
  nondrivingVideos().forEach(video => shouldPlay ? video.play().catch(() => {}) : video.pause());
  updateNondrivingVideoState();
});
motivationPlayButton.addEventListener("click", () => {
  setMotivationPlaying(motivationVideos.some(video => video.paused));
});
cmpTimeline.addEventListener("input", () => {
  startComparison();
  setComparisonFrame(Number(cmpTimeline.value));
});
internalTimeline.addEventListener("input", () => {
  startInternalComparison();
  setInternalFrame(Number(internalTimeline.value));
});
nondrivingTimeline.addEventListener("input", () => {
  startNondrivingComparison();
  setNondrivingFrame(Number(nondrivingTimeline.value));
});
novelTimeline.addEventListener("input", () => {
  startNovelComparison();
  setNovelFrame(Number(novelTimeline.value));
});
motivationTimeline.addEventListener("input", () => {
  const time = Number(motivationTimeline.value) / motivationFps;
  motivationVideos.forEach(video => video.currentTime = time);
});
document.querySelector(".left").addEventListener("click", () => setScene(scene - 1));
document.querySelector(".right").addEventListener("click", () => setScene(scene + 1));
sceneButtons.forEach((button, i) => {
  button.style.backgroundImage = `url("media/thumbs/${scenes[i].id}.jpg")`;
  button.addEventListener("click", () => setScene(i));
});
modelPicker.addEventListener("click", event => {
  const button = event.target.closest("[data-model]");
  if (button) {
    startComparison();
    toggleModel(button.dataset.model);
  }
});
internalModelPicker.addEventListener("click", event => {
  const button = event.target.closest("[data-internal-model]");
  if (button) {
    startInternalComparison();
    toggleInternalModel(button.dataset.internalModel);
  }
});
waymoThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-comparison-scene]");
  if (button) {
    startComparison();
    setComparisonScene(Number(button.dataset.comparisonScene));
  }
});
internalThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-internal-scene]");
  if (button) {
    startInternalComparison();
    setInternalScene(Number(button.dataset.internalScene));
  }
});
nondrivingThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-nondriving-scene]");
  if (button) {
    startNondrivingComparison();
    setNondrivingScene(Number(button.dataset.nondrivingScene));
  }
});
document.querySelector("#comparison-novel").addEventListener("click", event => {
  const shift = event.target.closest("[data-shift]");
  const yaw = event.target.closest("[data-yaw]");
  const sideShift = event.target.closest("[data-side-shift]");
  const novelScene = event.target.closest("[data-novel-scene]");
  if (shift || yaw || sideShift || novelScene) startNovelComparison();
  if (novelScene) {
    novelGalleryScene = Number(novelScene.dataset.novelScene);
    setNovelScene();
  }
  if (shift) {
    novelShift = shift.dataset.shift;
    setNovelScene();
  }
  if (yaw) {
    novelYaw = yaw.dataset.yaw;
    setNovelScene();
  }
  if (sideShift) {
    novelSideShift = sideShift.dataset.sideShift;
    setNovelScene();
  }
});
closedLoopThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-closed-loop-scene]");
  if (button) setClosedLoopScene(Number(button.dataset.closedLoopScene));
});
stylizationThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-stylization-scene]");
  if (button) setStylizationScene(Number(button.dataset.stylizationScene));
});
multicamThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-multicam-scene]");
  if (button) setMulticamScene(Number(button.dataset.multicamScene));
});
highresThumbs.addEventListener("click", event => {
  const button = event.target.closest("[data-highres-scene]");
  if (button) setHighresScene(Number(button.dataset.highresScene));
});
novelPlayButton.addEventListener("click", () => {
  startNovelComparison();
  if (novelComposite.paused) {
    novelPlaying = true;
    novelComposite.play().catch(() => {});
  } else {
    novelPlaying = false;
    novelComposite.pause();
  }
  updateNovelVideoState();
});
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") setScene(scene - 1);
  if (event.key === "ArrowRight") setScene(scene + 1);
  if (event.key === " ") {
    event.preventDefault();
    playButton.click();
  }
});

renderModelPicker();
renderWaymoThumbs();
renderInternalModelPicker();
renderInternalThumbs();
renderNovelSelectors();
renderNovelThumbs();
setClosedLoopScene(0);
setStylizationScene(0);
setMulticamScene(0);
setHighresScene(0);
bindMediaControls(closedLoopVideo, closedLoopPlay, closedLoopTimeline, closedLoopTime);
bindMediaGroupControls(stylizationVideos, stylizationPlay, stylizationTimeline, stylizationTime);
bindMediaControls(multicamVideo, multicamPlay, multicamTimeline, multicamTime);
bindLoadingIndicator(closedLoopVideo, closedLoopLoader);
bindLoadingIndicator(multicamVideo, multicamLoader);
bindLoadingIndicator(highresImage, highresLoader);
motivationVideos.forEach(video => {
  video.playbackRate = 2;
  ["loadstart", "loadedmetadata", "progress", "waiting", "canplay", "playing", "timeupdate"].forEach(eventName => {
    video.addEventListener(eventName, updateMotivationLoadState);
  });
  video.addEventListener("ended", () => {
    video.currentTime = motivationStartFrame / motivationFps;
    if (motivationPlaying) video.play().catch(() => {});
  });
});
motivationVideos[0]?.addEventListener("loadedmetadata", () => {
  motivationFrames = Math.max(1, Math.round(motivationVideos[0].duration * motivationFps));
  motivationTimeline.max = motivationFrames;
  motivationTimeline.min = motivationStartFrame;
  motivationTimeline.value = motivationStartFrame;
  motivationVideos.forEach(video => video.currentTime = motivationStartFrame / motivationFps);
  if (motivationPlaying) setMotivationPlaying(true);
  motivationFrameLabel.textContent = `Frame ${motivationStartFrame} / ${motivationFrames}`;
  updateMotivationLoadState();
});
setScene(0).then(() => {
  setTimeout(preloadMotivationVideo, 500);
  prewarmGalleries();
});
initWhenNear("#comparison", startComparison);
initWhenNear("#comparison-internal", startInternalComparison);
initWhenNear("#comparison-nondriving", startNondrivingComparison);
initWhenNear("#comparison-novel", startNovelComparison);
requestAnimationFrame(tick);
requestAnimationFrame(syncMotivationVideos);
