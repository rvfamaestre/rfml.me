import { useCallback, useEffect, useMemo, useRef, useState } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm";
import { jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@18.2.0/jsx-runtime/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { easeStandard, easeDramatic } from "./utils/easings.js";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1
});

const plainNumberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0
});

const updatedDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

const formatGithubCount = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  if (value >= 1000) {
    return compactNumberFormatter.format(value);
  }
  return plainNumberFormatter.format(value);
};

const formatGithubUpdated = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return updatedDateFormatter.format(parsed);
};

export default function GalleryApp({ projects = [] }) {
  const containerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const projectScrollRef = useRef(null);
  const projectOverlayRef = useRef(null);
  const touchStartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewMode, setViewMode] = useState("gallery");
  const [isSceneReady, setSceneReady] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [, forceGithubRerender] = useState(0);

  const runtimeRef = useRef({
    scene: null,
    renderer: null,
    camera: null,
    clock: null,
    frameItems: [],
    hovered: null,
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    controls: {
      yaw: 0,
      pitch: -0.1,
      targetYaw: 0,
      targetPitch: -0.1,
      dragging: false,
      lastPointer: { x: 0, y: 0 },
      spinInput: 0,
      tiltInput: 0,
      spinSmooth: 0,
      tiltSmooth: 0
    },
    transition: null,
    labels: [],
    projectPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    disposed: false,
    requestId: null,
    textureLoader: null,
    loadQueue: [],
    loadedCount: 0,
    viewState: "gallery",
    active: null,
    audio: null,
    ambienceStarted: false,
    readyNotified: false,
    homeLookTarget: null,
    orientationFlip: null
  });
  const githubCacheRef = useRef({});

  const totalProjects = projects.length;

  const activeProject = useMemo(
    () => (typeof activeIndex === "number" ? projects[activeIndex] ?? null : null),
    [activeIndex, projects]
  );

  const projectVariant = useMemo(() => {
    if (!activeProject) return "visual";
    if (activeProject.variant) return activeProject.variant;
    const category = (activeProject.category || "").toLowerCase();
    if (
      /software|electronics|automation|quant|control|security|robot|deep|ai|finance|systems|iot|engineering|plasma|material|satellite/.test(
        category
      )
    ) {
      return "technical";
    }
    if (/charity|story|experimental|heritage|concept|narrative|sustain|immersive/.test(category)) {
      return "concept";
    }
    return "visual";
  }, [activeProject]);

  const projectMediaList = useMemo(() => {
    if (!activeProject) return [];
    const normalize = (entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        const lower = entry.toLowerCase();
        const isVideo = /\.(mp4|webm|mov)$/.test(lower) || lower.includes("video");
        return {
          src: entry,
          kind: isVideo ? "video" : "image",
          caption: "",
          alt: `${activeProject.title} media`
        };
      }
      if (typeof entry === "object" && entry.src) {
        const lower = String(entry.src).toLowerCase();
        const kind = entry.kind || entry.type || (/\.(mp4|webm|mov)$/.test(lower) ? "video" : "image");
        return {
          src: entry.src,
          kind,
          caption: entry.caption || entry.title || "",
          alt: entry.alt || entry.caption || `${activeProject.title} media`
        };
      }
      return null;
    };
    const heroCandidate = normalize(activeProject.heroImage || activeProject.cover || activeProject.image);
    const supplementalRaw = Array.isArray(activeProject.gallery)
      ? activeProject.gallery
      : Array.isArray(activeProject.media)
      ? activeProject.media
      : [];
    const supplemental = supplementalRaw.map(normalize).filter(Boolean);
    const combined = [];
    const seen = new Set();
    if (heroCandidate && !seen.has(heroCandidate.src)) {
      combined.push(heroCandidate);
      seen.add(heroCandidate.src);
    }
    supplemental.forEach((item) => {
      if (!item || !item.src || seen.has(item.src)) return;
      combined.push(item);
      seen.add(item.src);
    });
    return combined;
  }, [activeProject]);

  const heroMedia = projectMediaList[0] || null;
  const galleryMedia = projectMediaList.slice(1);

  const projectDescription = useMemo(() => {
    if (!activeProject) return "";
    if (Array.isArray(activeProject.description)) {
      return activeProject.description.join("\n\n");
    }
    if (activeProject.description) {
      return activeProject.description;
    }
    const category = (activeProject.category || "interdisciplinary studio").toLowerCase();
    const dateSegments = (activeProject.date || "").split("|").map((part) => part.trim());
    const cadence = dateSegments[1] ? ` developed over ${dateSegments[1].toLowerCase()}` : "";
    return `A ${category} study${cadence}, composed as a quiet investigation into form, light, and intent.`;
  }, [activeProject]);

  const descriptionParagraphs = useMemo(() => {
    if (!projectDescription) return [];
    if (Array.isArray(activeProject?.description)) {
      return activeProject.description.filter(Boolean);
    }
    return String(projectDescription)
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [activeProject?.description, projectDescription]);

  const detailItems = useMemo(() => {
    if (!activeProject) return [];
    if (Array.isArray(activeProject.details)) {
      return activeProject.details.filter((item) => item && item.label && item.value);
    }
    const items = [];
    if (activeProject.category) {
      items.push({ label: "Discipline", value: activeProject.category });
    }
    if (activeProject.date) {
      items.push({ label: "Timeline", value: activeProject.date });
    }
    return items;
  }, [activeProject]);

  const projectTechnologies = useMemo(() => {
    if (!activeProject) return [];
    if (Array.isArray(activeProject.technologies)) {
      return activeProject.technologies.filter(Boolean);
    }
    if (Array.isArray(activeProject.stack)) {
      return activeProject.stack.filter(Boolean);
    }
    return [];
  }, [activeProject]);

  const technicalHighlights = useMemo(() => {
    if (!activeProject) return [];
    const highlights = activeProject.highlights || activeProject.achievements || activeProject.milestones;
    if (Array.isArray(highlights)) {
      return highlights.filter(Boolean);
    }
    return [];
  }, [activeProject]);

  const projectLinks = useMemo(() => {
    if (!activeProject) return [];
    if (!Array.isArray(activeProject.links)) return [];
    return activeProject.links
      .filter((item) => item && typeof item === "object" && item.url)
      .map((item, idx) => ({
        label: item.label || `Resource ${idx + 1}`,
        url: item.url
      }));
  }, [activeProject]);

  const githubConfig = useMemo(() => {
    if (!activeProject?.github) return null;
    const repoCandidate = activeProject.github.repo || activeProject.github.url || "";
    const trimmed = String(repoCandidate).trim();
    if (!trimmed) return null;
    const normalized = trimmed
      .replace(/^https?:\/\/github\.com\//i, "")
      .replace(/\.git$/i, "")
      .replace(/\/+$/, "");
    if (!normalized) return null;
    return {
      repo: normalized,
      url: activeProject.github.url || `https://github.com/${normalized}`,
      description: activeProject.github.description || "",
      branch: activeProject.github.branch || "main"
    };
  }, [activeProject]);

  const githubEntry = githubConfig ? githubCacheRef.current[githubConfig.repo] : null;
  const githubStatus = githubEntry?.status || "idle";
  const githubData = githubEntry?.data || null;
  const githubError = githubEntry?.error || "";
  const displayGithubStatus = githubConfig && githubStatus === "idle" ? "loading" : githubStatus;
  const githubRepoLabel = githubData?.fullName || githubConfig?.repo || "";
  const githubUrl = githubData?.url || githubConfig?.url || (githubConfig ? `https://github.com/${githubConfig.repo}` : "");
  const githubDescription =
    githubData?.description || githubConfig?.description || "Live repository telemetry for this build.";
  const githubBranchLabel = githubData?.defaultBranch || githubConfig?.branch || "main";
  const githubLicenseLabel = githubData?.license || "";
  const githubLanguageLabel = githubData?.language || "";
  const githubUpdatedLabel = githubData?.updatedAt ? formatGithubUpdated(githubData.updatedAt) : null;
  const githubMetrics = githubData
    ? [
        { label: "Stars", value: githubData.stars ?? 0 },
        { label: "Forks", value: githubData.forks ?? 0 },
        { label: "Watchers", value: githubData.watchers ?? 0 },
        { label: "Open Issues", value: githubData.issues ?? 0 }
      ]
    : [];

  useEffect(() => {
    const repo = githubConfig?.repo;
    if (!repo) return;
    if (githubCacheRef.current[repo]) return;

    let cancelled = false;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    githubCacheRef.current[repo] = { status: "loading" };
    forceGithubRerender((value) => value + 1);

    fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json"
      },
      signal: controller?.signal
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub request failed (${response.status})`);
        }
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        githubCacheRef.current[repo] = {
          status: "loaded",
          data: {
            fullName: payload.full_name || repo,
            description: payload.description || githubConfig?.description || "",
            stars: payload.stargazers_count ?? 0,
            forks: payload.forks_count ?? 0,
            issues: payload.open_issues_count ?? 0,
            watchers: payload.subscribers_count ?? payload.watchers_count ?? 0,
            language: payload.language || "",
            updatedAt: payload.updated_at || "",
            license: payload.license?.spdx_id || payload.license?.name || "",
            defaultBranch: payload.default_branch || githubConfig?.branch || "main",
            url: payload.html_url || githubConfig?.url || `https://github.com/${repo}`
          }
        };
        forceGithubRerender((value) => value + 1);
      })
      .catch((error) => {
        if (cancelled) return;
        githubCacheRef.current[repo] = {
          status: "error",
          error: error?.message || "Unable to load repository data."
        };
        forceGithubRerender((value) => value + 1);
      });
    return () => {
      cancelled = true;
      if (controller) {
        controller.abort();
      }
    };
  }, [githubConfig?.repo]);

  const handleGithubRetry = useCallback(() => {
    if (!githubConfig?.repo) return;
    delete githubCacheRef.current[githubConfig.repo];
    forceGithubRerender((value) => value + 1);
  }, [githubConfig?.repo]);

  const projectOrdinal = useMemo(() => {
    if (typeof activeIndex !== "number") return "";
    const current = activeIndex + 1;
    const total = totalProjects;
    return `${current.toString().padStart(2, "0")} / ${total.toString().padStart(2, "0")}`;
  }, [activeIndex, totalProjects]);

  const projectPositionLabel = useMemo(() => {
    if (typeof activeIndex !== "number") return "";
    return `Project ${activeIndex + 1} of ${totalProjects}`;
  }, [activeIndex, totalProjects]);

  const relatedProjects = useMemo(() => {
    if (!activeProject) return [];
    const baseCategory = (activeProject.category || "").toLowerCase();
    const pool = projects
      .map((project, index) => ({ project, index }))
      .filter((entry) => entry.index !== activeIndex);
    const primary = pool.filter(
      (entry) => baseCategory && (entry.project.category || "").toLowerCase().includes(baseCategory)
    );
    const used = new Set(primary.map((entry) => entry.index));
    const secondary = pool.filter((entry) => !used.has(entry.index));
    return [...primary, ...secondary].slice(0, 4);
  }, [projects, activeProject, activeIndex]);

  const parallaxHero = -scrollPosition * 0.12;
  const parallaxMeta = -scrollPosition * 0.06;
  const parallaxGallery = -scrollPosition * 0.03;
  const overlayVariantClass = ` project-variant-${projectVariant}`;
  const lightboxOpen = lightboxIndex !== null;
  const lightboxMedia = lightboxOpen && projectMediaList[lightboxIndex] ? projectMediaList[lightboxIndex] : null;
  useEffect(() => {
    runtimeRef.current.viewState = viewMode;
  }, [viewMode]);

  useEffect(() => {
    runtimeRef.current.active = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (viewMode !== "project") {
      setScrollPosition(0);
      setLightboxIndex(null);
      return;
    }
    const scrollElement = projectScrollRef.current;
    if (!scrollElement) return;
    scrollElement.scrollTo(0, 0);
    setScrollPosition(0);
  }, [viewMode, activeIndex]);

  useEffect(() => {
    if (viewMode !== "project") return;
    const scrollElement = projectScrollRef.current;
    if (!scrollElement) return;
    let frame = null;
    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollPosition(scrollElement.scrollTop);
      });
    };
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    setScrollPosition(scrollElement.scrollTop);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [viewMode, activeIndex]);

  useEffect(() => {
    if (viewMode !== "project") return;
    const container = projectScrollRef.current;
    if (!container) return;
    const nodes = container.querySelectorAll("[data-reveal]");
    nodes.forEach((node) => {
      node.classList.remove("revealed");
    });
    const revealVisible = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;
      nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.offsetTop < scrollTop + viewportHeight * 0.95) {
          node.classList.add("revealed");
        }
      });
    };
    revealVisible();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        root: container,
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px"
      }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [viewMode, activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((index) => {
          if (!projectMediaList.length) return null;
          const next = index === null ? 0 : (index + 1) % projectMediaList.length;
          return next;
        });
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => {
          if (!projectMediaList.length) return null;
          const next = index === null ? 0 : (index - 1 + projectMediaList.length) % projectMediaList.length;
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen, projectMediaList.length]);

  useEffect(() => {
    const container = containerRef.current;
    const labelsLayer = labelsLayerRef.current;
    if (!container || !labelsLayer) return;

    const runtime = runtimeRef.current;
    runtime.disposed = false;
    runtime.readyNotified = false;
    setSceneReady(false);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);

    const fog = new THREE.Fog(0xf5f5f3, 18, 48);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 120);
    const initialCameraPosition = new THREE.Vector3(0, 1.85, 0);
    const initialLookTarget = new THREE.Vector3(0, 1.6, -6);
    camera.position.copy(initialCameraPosition);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "crosshair";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 1.1, 80, Math.PI / 5, 0.45, 1);
    keyLight.position.set(-6, 12, 8);
    keyLight.target.position.set(0, 1, 0);
    scene.add(keyLight);
    scene.add(keyLight.target);

    const rimLight = new THREE.DirectionalLight(0xf8f8ff, 0.42);
    rimLight.position.set(7, 6, -4);
    scene.add(rimLight);

    const floorGeometry = new THREE.PlaneGeometry(120, 120, 1, 1);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xfdfdfc, roughness: 0.92, metalness: 0.04 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    scene.add(floor);

    const ceiling = floor.clone();
    ceiling.position.y = 12;
    ceiling.material = floorMaterial.clone();
    scene.add(ceiling);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfafaf8, roughness: 0.85, metalness: 0.02 });
    const wallGeometry = new THREE.PlaneGeometry(120, 48);
    const northWall = new THREE.Mesh(wallGeometry, wallMaterial);
    northWall.position.set(0, 4, -40);
    const southWall = northWall.clone();
    southWall.position.set(0, 4, 40);
    southWall.rotation.y = Math.PI;
    const eastWall = northWall.clone();
    eastWall.position.set(40, 4, 0);
    eastWall.rotation.y = -Math.PI / 2;
    const westWall = northWall.clone();
    westWall.position.set(-40, 4, 0);
    westWall.rotation.y = Math.PI / 2;
    scene.add(northWall, southWall, eastWall, westWall);

    runtime.scene = scene;
    runtime.renderer = renderer;
    runtime.camera = camera;
    runtime.clock = new THREE.Clock();
    const galleryCenter = new THREE.Vector3(0, 1.6, 0);

    camera.lookAt(initialLookTarget);
    const homeDirection = new THREE.Vector3().subVectors(initialLookTarget, initialCameraPosition).normalize();
    runtime.controls.yaw = Math.atan2(homeDirection.x, homeDirection.z);
    runtime.controls.targetYaw = runtime.controls.yaw;
    runtime.controls.pitch = Math.asin(THREE.MathUtils.clamp(homeDirection.y, -0.999, 0.999));
    runtime.controls.targetPitch = runtime.controls.pitch;
    runtime.homePosition = initialCameraPosition.clone();
    runtime.homeQuaternion = camera.quaternion.clone();
    runtime.homeYaw = runtime.controls.yaw;
    runtime.homePitch = runtime.controls.pitch;
    runtime.homeLookTarget = initialLookTarget.clone();
    runtime.orientationFlip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

    runtime.textureLoader = new THREE.TextureLoader();
    runtime.textureLoader.setCrossOrigin("anonymous");
    runtime.frameItems = [];
    runtime.labels = Array.from(labelsLayer.querySelectorAll(".frame-label"));

    const perRing = 12;
    const angleStep = (Math.PI * 2) / perRing;
    const baseRadius = 8.8;
    const ringSpacing = 2.6;

    const frameBackMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfdfdfd,
      roughness: 0.32,
      metalness: 0.12,
      clearcoat: 0.28,
      clearcoatRoughness: 0.6
    });

    const frameInsetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const frameGeometry = new THREE.BoxGeometry(1.8, 1.8, 0.12);
    const mattingGeometry = new THREE.PlaneGeometry(1.66, 1.66);
    const artworkGeometry = new THREE.PlaneGeometry(1.48, 1.48);

    const createFrameGroup = (project, index) => {
      const group = new THREE.Group();
      const frameMesh = new THREE.Mesh(frameGeometry, frameBackMaterial.clone());
      frameMesh.castShadow = false;
      group.add(frameMesh);

      const mattingMesh = new THREE.Mesh(mattingGeometry, frameInsetMaterial.clone());
      mattingMesh.position.z = 0.065;
      group.add(mattingMesh);

      const artworkMaterial = new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0x101010 : 0x0e0e0e });
      const artworkMesh = new THREE.Mesh(artworkGeometry, artworkMaterial);
      artworkMesh.position.z = 0.072;
      artworkMesh.userData.isArtwork = true;
      group.add(artworkMesh);

      const ringIndex = Math.floor(index / perRing);
      const ringPosition = index % perRing;
      const baseTheta = ringPosition * angleStep + ringIndex * 0.32 + (index % 3) * 0.05;
      const radius = baseRadius + ringSpacing * ringIndex + Math.sin(ringPosition * 0.92) * 0.4;
      const heightBase = (ringPosition % 6 - 2.5) * 0.9 + ringIndex * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const speed = 0.042 + ringIndex * 0.004;
      const bobAmplitude = 0.38 + Math.random() * 0.28;
      const bobFrequency = 0.55 + Math.random() * 0.3;
      const radialPulse = 0.05 + Math.random() * 0.035;

      const initialRadius = radius + Math.sin(phase) * radialPulse;
      const initialHeight = heightBase + Math.sin(phase) * bobAmplitude;
      group.position.set(
        Math.cos(baseTheta) * initialRadius,
        initialHeight,
        Math.sin(baseTheta) * initialRadius
      );

      const initialFocus = new THREE.Vector3(0, galleryCenter.y, 0);
      group.lookAt(initialFocus);
      group.rotateY(Math.PI);

      const highlight = new THREE.Mesh(
        new THREE.PlaneGeometry(1.86, 1.86),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      );
      highlight.position.z = 0.06;
      group.add(highlight);

      scene.add(group);

      return {
        index,
        project,
        group,
        frameMesh,
        artworkMesh,
        highlight,
        orbit: {
          baseTheta,
          radius,
          heightBase,
          speed,
          bobAmplitude,
          bobFrequency,
          radialPulse,
          phase,
          timeOffset: 0,
          isFrozen: false,
          frozenTime: 0
        },
        loaded: false,
        loading: false,
        texture: null
      };
    };

    projects.forEach((project, index) => {
      const item = createFrameGroup(project, index);
      runtime.frameItems.push(item);
    });

    const loadCanvasTexture = (item) => {
      if (item.loaded || item.loading) return;
      item.loading = true;
      runtime.textureLoader.load(
        item.project.image,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
          const material = new THREE.MeshBasicMaterial({ map: texture });
          material.transparent = false;
          item.artworkMesh.material = material;
          item.texture = texture;
          item.loaded = true;
          item.loading = false;
          runtime.loadedCount += 1;
          if (!runtimeRef.current.readyNotified && runtime.loadedCount >= Math.min(projects.length, 3)) {
            runtimeRef.current.readyNotified = true;
            setSceneReady(true);
          }
        },
        undefined,
        () => {
          item.loading = false;
        }
      );
    };

    runtime.loadQueue = runtime.frameItems.slice(0, Math.min(8, runtime.frameItems.length));
    runtime.loadQueue.forEach(loadCanvasTexture);

    const ensureAdjacentLoaded = (index) => {
      if (typeof index !== "number") return;
      const indices = [index, index - 1, index + 1].map((i) => (i + projects.length) % projects.length);
      indices.forEach((idx) => {
        const frame = runtime.frameItems[idx];
        loadCanvasTexture(frame);
      });
    };

    runtime.loadCanvasTexture = loadCanvasTexture;
    runtime.ensureAdjacentLoaded = ensureAdjacentLoaded;

    const startAmbience = () => {
      if (runtime.ambienceStarted) return;
      runtime.ambienceStarted = true;
      const audio = new Audio("https://cdn.pixabay.com/audio/2022/02/17/audio_b96afeeb39.mp3");
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.volume = 0.28;
      audio.play().catch(() => {});
      runtime.audio = audio;
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      startAmbience();
      const rect = renderer.domElement.getBoundingClientRect();
      runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      runtime.controls.spinInput = runtime.pointer.x;
      runtime.controls.tiltInput = runtime.pointer.y;
    };

    const onPointerUp = (event) => {
      if (event.button !== 0) return;
      const rect = renderer.domElement.getBoundingClientRect();
      runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      runtime.controls.spinInput = runtime.pointer.x;
      runtime.controls.tiltInput = runtime.pointer.y;
    };

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      runtime.controls.spinInput = runtime.pointer.x;
      runtime.controls.tiltInput = runtime.pointer.y;
    };

    const onPointerLeave = () => {
      runtime.pointer.set(0, 0);
      runtime.controls.spinInput = 0;
      runtime.controls.tiltInput = 0;
    };

    const onClick = (event) => {
      if (runtime.viewState !== "gallery") return;
      if (runtime.hovered) {
        event.preventDefault();
        openFrame(runtime.hovered);
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (runtime.viewState === "gallery") {
        const direction = new THREE.Vector3();
        runtime.camera.getWorldDirection(direction);
        const zoomIntensity = THREE.MathUtils.clamp(event.deltaY * 0.0012, -1.8, 1.8);
        runtime.camera.position.addScaledVector(direction, zoomIntensity);
        runtime.camera.position.y = THREE.MathUtils.clamp(runtime.camera.position.y, 0.8, 9);
      } else if (runtime.viewState === "project" && Math.abs(event.deltaY) > 18) {
        if (event.deltaY > 0) {
          navigateProject(1);
        } else {
          navigateProject(-1);
        }
      }
    };

    const onKeyDown = (event) => {
      if (event.code === "Escape") {
        if (runtime.viewState === "project") {
          closeProject();
        }
        return;
      }
      if (runtime.viewState === "project") {
        if (event.code === "ArrowRight") {
          navigateProject(1);
        } else if (event.code === "ArrowLeft") {
          navigateProject(-1);
        }
      }
    };

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    const openFrame = (frameItem) => {
      if (runtime.transition) return;
      ensureAdjacentLoaded(frameItem.index);
      const focusPoint = frameItem.group.getWorldPosition(new THREE.Vector3());
      const frameForward = new THREE.Vector3(0, 0, 1).applyQuaternion(frameItem.group.quaternion).normalize();
      const toPosition = focusPoint.clone().addScaledVector(frameForward, 2.6).add(new THREE.Vector3(0, 0.25, 0));
      const toQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(toPosition, focusPoint, new THREE.Vector3(0, 1, 0))
      );
      runtime.transition = {
        type: "enter",
        start: performance.now(),
        duration: 2200,
        fromPosition: camera.position.clone(),
        toPosition,
        fromQuaternion: camera.quaternion.clone(),
        toQuaternion,
        focusFrame: frameItem
      };
      const planar = new THREE.Vector2(toPosition.x - focusPoint.x, toPosition.z - focusPoint.z);
      runtime.controls.targetYaw = Math.atan2(planar.x, planar.y);
      runtime.controls.targetPitch = Math.atan2(
        toPosition.y - focusPoint.y,
        Math.max(planar.length(), 1e-4)
      );
      runtime.viewState = "transitioning";
      setViewMode("transitioning");
      setActiveIndex(frameItem.index);
    };

    const closeProject = () => {
      if (runtime.transition || runtime.viewState !== "project") return;
      runtime.transition = {
        type: "exit",
        start: performance.now(),
        duration: 1650,
        fromPosition: camera.position.clone(),
        toPosition: runtime.homePosition.clone(),
        fromQuaternion: camera.quaternion.clone(),
        toQuaternion: runtime.homeQuaternion.clone(),
        focusFrame: runtime.frameItems[runtime.active ?? activeIndex ?? 0]
      };
      runtime.controls.targetYaw = runtime.homeYaw;
      runtime.controls.targetPitch = runtime.homePitch;
      runtime.viewState = "transitioning";
      setViewMode("transitioning");
    };

    const navigateProject = (direction) => {
      if (typeof runtime.active !== "number" || runtime.viewState !== "project") return;
      const nextIndex = (runtime.active + direction + projects.length) % projects.length;
      setActiveIndex(nextIndex);
      ensureAdjacentLoaded(nextIndex);
    };

    runtime.internalClose = closeProject;
    runtime.internalNavigate = navigateProject;

    const animate = () => {
      if (runtime.disposed) return;
      runtime.requestId = requestAnimationFrame(animate);
      const delta = Math.min(runtime.clock.getDelta(), 0.045);
      const elapsedTime = runtime.clock.elapsedTime;

      runtime.controls.yaw = THREE.MathUtils.damp(runtime.controls.yaw, runtime.controls.targetYaw, 4, delta);
      runtime.controls.pitch = THREE.MathUtils.damp(runtime.controls.pitch, runtime.controls.targetPitch, 4, delta);

      if (runtime.viewState === "gallery") {
        const spinTarget = THREE.MathUtils.clamp(runtime.controls.spinInput, -1, 1);
        const tiltTarget = THREE.MathUtils.clamp(runtime.controls.tiltInput, -1, 1);
        runtime.controls.spinSmooth = THREE.MathUtils.damp(runtime.controls.spinSmooth, spinTarget, 3.6, delta);
        runtime.controls.tiltSmooth = THREE.MathUtils.damp(runtime.controls.tiltSmooth, tiltTarget, 3.6, delta);

        const spinMagnitude = Math.abs(runtime.controls.spinSmooth);
        const yawAcceleration = 1.85;
        const yawDelta = runtime.controls.spinSmooth * spinMagnitude * yawAcceleration * delta;
        runtime.controls.targetYaw -= yawDelta;

        const desiredPitch = THREE.MathUtils.clamp(
          runtime.homePitch + runtime.controls.tiltSmooth * 0.45,
          -0.95,
          0.5
        );
        runtime.controls.targetPitch = THREE.MathUtils.damp(
          runtime.controls.targetPitch,
          desiredPitch,
          3,
          delta
        );

        const directionVector = new THREE.Vector3(
          Math.sin(runtime.controls.yaw),
          Math.tan(runtime.controls.pitch),
          Math.cos(runtime.controls.yaw)
        ).normalize();
        const sideways = new THREE.Vector3().crossVectors(directionVector, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3(0, 1, 0);

        camera.position.y = THREE.MathUtils.clamp(camera.position.y, -1, 8);

        const lookTarget = new THREE.Vector3(
          camera.position.x + Math.sin(runtime.controls.yaw) * Math.cos(runtime.controls.pitch),
          camera.position.y + Math.sin(runtime.controls.pitch),
          camera.position.z + Math.cos(runtime.controls.yaw) * Math.cos(runtime.controls.pitch)
        );
        camera.lookAt(lookTarget);
      }

      runtime.hovered = null;
      runtime.raycaster.setFromCamera(runtime.pointer, camera);
      const intersects = runtime.raycaster.intersectObjects(
        runtime.frameItems.map((item) => item.artworkMesh),
        false
      );
      if (intersects.length > 0) {
        const match = runtime.frameItems.find((item) => item.artworkMesh === intersects[0].object);
        runtime.hovered = match || null;
      }

      runtime.frameItems.forEach((item) => {
        const frame = item.group;
        const orbit = item.orbit;
        const isActiveIndex = typeof runtime.active === "number" && runtime.active === item.index;
        const isTransitionFocus = runtime.transition?.focusFrame === item;
        const isFrozen = runtime.viewState !== "gallery" && (isActiveIndex || isTransitionFocus);

        if (orbit) {
          if (isFrozen) {
            if (!orbit.isFrozen) {
              orbit.isFrozen = true;
              orbit.frozenTime = elapsedTime;
            }
          } else {
            if (orbit.isFrozen) {
              orbit.timeOffset += elapsedTime - orbit.frozenTime;
              orbit.isFrozen = false;
            }
            const orbitTime = elapsedTime - orbit.timeOffset;
            const orbitAngle = orbit.baseTheta + orbitTime * orbit.speed;
            const radial = orbit.radius + Math.sin(orbitTime * 0.45 + orbit.phase) * orbit.radialPulse;
            const x = Math.cos(orbitAngle) * radial;
            const z = Math.sin(orbitAngle) * radial;
            const y = orbit.heightBase + Math.sin(orbitTime * orbit.bobFrequency + orbit.phase) * orbit.bobAmplitude;
            frame.position.set(x, y, z);

            const lookTarget = new THREE.Vector3(0, galleryCenter.y + Math.sin(orbitTime * 0.18 + orbit.phase) * 0.25, 0);
            const baseQuat = new THREE.Quaternion().setFromRotationMatrix(
              new THREE.Matrix4().lookAt(frame.position.clone(), lookTarget, new THREE.Vector3(0, 1, 0))
            );
            const facingQuat = baseQuat.multiply(runtime.orientationFlip);
            const driftQuat = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(
                Math.sin(orbitTime * 0.6 + orbit.phase) * 0.04,
                Math.cos(orbitTime * 0.5 + orbit.phase) * 0.06,
                Math.sin(orbitTime * 0.4 + orbit.phase) * 0.02
              )
            );
            const finalQuat = facingQuat.clone().multiply(driftQuat);
            frame.quaternion.slerp(finalQuat, 0.08);
          }
        }

        const highlightTarget = runtime.hovered === item ? 0.32 : 0;
        item.highlight.material.opacity = THREE.MathUtils.damp(
          item.highlight.material.opacity,
          highlightTarget,
          4,
          delta
        );

        if (!item.loaded) {
          const distance = frame.position.distanceTo(camera.position);
          if (distance < 18) {
            loadCanvasTexture(item);
          }
        }
      });

      if (runtime.transition) {
        const now = performance.now();
        const t = THREE.MathUtils.clamp((now - runtime.transition.start) / runtime.transition.duration, 0, 1);
        const eased = runtime.transition.type === "enter" ? easeDramatic(t) : easeStandard(t);

        camera.position.lerpVectors(runtime.transition.fromPosition, runtime.transition.toPosition, eased);
        camera.quaternion.slerp(runtime.transition.toQuaternion, eased);

        if (t >= 1) {
          if (runtime.transition.type === "enter") {
            runtime.viewState = "project";
            setViewMode("project");
            runtime.active = runtime.transition.focusFrame.index;
          } else {
            runtime.viewState = "gallery";
            setViewMode("gallery");
            runtime.active = null;
            setActiveIndex(null);
            runtime.controls.yaw = runtime.homeYaw;
            runtime.controls.pitch = runtime.homePitch;
            runtime.controls.targetYaw = runtime.homeYaw;
            runtime.controls.targetPitch = runtime.homePitch;
          }
          runtime.transition = null;
        }
      }

      const updateLabels = () => {
        const { clientWidth, clientHeight } = renderer.domElement;
        runtime.frameItems.forEach((item, idx) => {
          const el = runtime.labels[idx];
          if (!el) return;
          if (runtime.viewState !== "gallery" && runtime.active === idx) {
            el.classList.remove("visible");
            return;
          }
          const worldPosition = item.group.getWorldPosition(new THREE.Vector3());
          const projected = worldPosition.clone().project(camera);
          const isVisible = projected.z < 1 && projected.z > -1;
          if (!isVisible) {
            el.classList.remove("visible");
            return;
          }
          const x = (projected.x * 0.5 + 0.5) * clientWidth;
          const y = (-projected.y * 0.5 + 0.5) * clientHeight;
          const distance = camera.position.distanceTo(worldPosition);
          const offset = THREE.MathUtils.clamp(420 / Math.max(distance, 0.0001), 18, 72);
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.transform = `translate(-50%, ${offset}px)`;
          if (runtime.viewState === "gallery") {
            el.classList.add("visible");
          } else {
            el.classList.remove("visible");
          }
        });
      };

      updateLabels();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      runtime.disposed = true;
      cancelAnimationFrame(runtime.requestId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);

      runtime.frameItems.forEach((item) => {
        if (item.texture) {
          item.texture.dispose();
        }
        item.group.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (child.material?.dispose) {
              child.material.dispose();
            }
          }
        });
        scene.remove(item.group);
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
      runtime.audio?.pause();
      runtime.audio = null;
    };
  }, [projects]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (typeof activeIndex === "number") {
      runtime.active = activeIndex;
      if (runtime.frameItems[activeIndex]?.highlight) {
        runtime.frameItems[activeIndex].highlight.material.opacity = 0;
      }
      runtime.internalActivateIndex = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    if (viewMode === "project" && typeof activeIndex === "number") {
      runtimeRef.current.ensureAdjacentLoaded?.(activeIndex);
    }
  }, [viewMode, activeIndex]);

  useEffect(() => {
    const dom = runtimeRef.current.renderer?.domElement;
    if (!dom) return;
    dom.style.cursor = viewMode === "gallery" ? "crosshair" : "default";
  }, [viewMode]);

  const closeProject = useCallback(() => {
    setLightboxIndex(null);
    runtimeRef.current.internalClose?.();
  }, []);

  const navigateProject = useCallback((direction) => {
    setLightboxIndex(null);
    runtimeRef.current.internalNavigate?.(direction);
  }, []);

  const selectProject = useCallback(
    (nextIndex) => {
      if (typeof nextIndex !== "number" || nextIndex === activeIndex) return;
      runtimeRef.current.ensureAdjacentLoaded?.(nextIndex);
      setLightboxIndex(null);
      setActiveIndex(nextIndex);
    },
    [activeIndex]
  );

  const openLightboxAt = useCallback(
    (index) => {
      if (!projectMediaList.length) return;
      const normalized = ((index ?? 0) + projectMediaList.length) % projectMediaList.length;
      setLightboxIndex(normalized);
    },
    [projectMediaList.length]
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const stepLightbox = useCallback(
    (direction) => {
      if (!projectMediaList.length) return;
      setLightboxIndex((current) => {
        const base = typeof current === "number" ? current : 0;
        return (base + direction + projectMediaList.length) % projectMediaList.length;
      });
    },
    [projectMediaList.length]
  );

  const handleProjectTouchStart = useCallback((event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: performance.now()
    };
  }, []);

  const handleProjectTouchEnd = useCallback(
    (event) => {
      if (!touchStartRef.current || event.changedTouches.length === 0) return;
      const start = touchStartRef.current;
      touchStartRef.current = null;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const dt = performance.now() - start.time;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60 && dt < 600) {
        if (dx < 0) {
          navigateProject(1);
        } else {
          navigateProject(-1);
        }
      }
    },
    [navigateProject]
  );

  const overlaySections = [];

  if (heroMedia) {
    const heroKey = `hero-${activeProject?.title || "project"}`;
    const heroAlt = heroMedia.alt || `${activeProject?.title || "Project"} hero`;
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-hero",
          "data-reveal": "",
          children: [
            jsx("figure", {
              className: "project-hero-frame",
              style: { transform: `translateY(${parallaxHero}px)` },
              children: jsx(
                "button",
                {
                  type: "button",
                  className: "project-media-trigger",
                  onClick: () => openLightboxAt(0),
                  children:
                    heroMedia.kind === "video"
                      ? jsx("video", {
                          className: "project-hero-asset",
                          src: heroMedia.src,
                          muted: true,
                          loop: true,
                          autoPlay: true,
                          playsInline: true
                        })
                      : jsx("img", {
                          className: "project-hero-asset",
                          src: heroMedia.src,
                          alt: heroAlt,
                          loading: "eager"
                        })
                }
              )
            })
          ]
        },
        heroKey
      )
    );
  }

  if (activeProject) {
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-header",
          "data-reveal": "",
          style: { transform: `translateY(${parallaxMeta}px)` },
          children: [
            jsx("h2", {
              className: "project-title",
              children: activeProject.title
            }),
            jsxs("div", {
              className: "project-meta-stack",
              children: [
                activeProject.date
                  ? jsx("span", { className: "project-meta-primary", children: activeProject.date }, "meta-date")
                  : null,
                activeProject.category
                  ? jsx(
                      "span",
                      {
                        className: "project-meta-tag",
                        children: activeProject.category
                      },
                      "meta-category"
                    )
                  : null,
                projectVariant
                  ? jsx(
                      "span",
                      {
                        className: "project-variant-label",
                        children: projectVariant === "technical" ? "Technical Study" : projectVariant === "concept" ? "Conceptual Study" : "Visual Study"
                      },
                      "meta-variant"
                    )
                  : null
              ]
            })
          ]
        },
        "header"
      )
    );
  }

  if (descriptionParagraphs.length > 0) {
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-description",
          "data-reveal": "",
          children: descriptionParagraphs.map((paragraph, index) =>
            jsx(
              "p",
              {
                children: paragraph
              },
              `description-${index}`
            )
          )
        },
        "description"
      )
    );
  }

  const showTechnicalSection =
    detailItems.length > 0 || projectTechnologies.length > 0 || technicalHighlights.length > 0 || projectLinks.length > 0;

  if (showTechnicalSection) {
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-technical",
          "data-reveal": "",
          children: [
            jsx("h3", { children: "Technical Details" }),
            detailItems.length
              ? jsx(
                  "ul",
                  {
                    className: "project-detail-list",
                    children: detailItems.map((item, index) =>
                      jsxs(
                        "li",
                        {
                          children: [
                            jsx("span", { className: "detail-label", children: item.label }),
                            jsx("span", { className: "detail-value", children: item.value })
                          ]
                        },
                        `detail-${index}`
                      )
                    )
                  },
                  "detail-list"
                )
              : null,
            projectTechnologies.length
              ? jsxs(
                  "div",
                  {
                    className: "project-technology-stack",
                    children: [
                      jsx("span", { className: "stack-label", children: "Technologies" }),
                      jsx("div", {
                        className: "stack-chips",
                        children: projectTechnologies.map((tool, index) =>
                          jsx(
                            "span",
                            {
                              className: "stack-chip",
                              children: tool
                            },
                            `tech-${index}`
                          )
                        )
                      })
                    ]
                  },
                  "technology"
                )
              : null,
            technicalHighlights.length
              ? jsxs(
                  "div",
                  {
                    className: "project-highlights",
                    children: [
                      jsx("span", { className: "highlights-label", children: "Highlights" }),
                      jsx("ul", {
                        children: technicalHighlights.map((note, index) =>
                          jsx(
                            "li",
                            {
                              children: note
                            },
                            `highlight-${index}`
                          )
                        )
                      })
                    ]
                  },
                  "highlights"
                )
              : null,
            githubConfig
              ? jsxs(
                  "div",
                  {
                    className: "github-widget",
                    "data-state": displayGithubStatus,
                    children: [
                      jsxs("div", {
                        className: "github-widget__header",
                        children: [
                          jsx("div", {
                            className: "github-widget__logo",
                            children: jsx("svg", {
                              viewBox: "0 0 24 24",
                              role: "img",
                              "aria-hidden": "true",
                              children: jsx("path", {
                                d: "M12 2C6.48 2 2 6.53 2 12.08c0 4.45 2.87 8.22 6.84 9.55.5.1.68-.22.68-.48 0-.23-.01-.84-.01-1.64-2.78.61-3.37-1.35-3.37-1.35-.45-1.17-1.11-1.48-1.11-1.48-.91-.63.07-.62.07-.62 1 .07 1.52 1.05 1.52 1.05.9 1.56 2.37 1.11 2.95.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5 0-1.1.39-2 1.03-2.7-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.03A9.2 9.2 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.3 2.74-1.03 2.74-1.03.56 1.4.21 2.44.1 2.7.64.7 1.03 1.6 1.03 2.7 0 3.87-2.33 4.73-4.56 4.99.36.32.68.94.68 1.91 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.11 10.11 0 0 0 22 12.08C22 6.53 17.52 2 12 2z"
                              })
                            })
                          }),
                          jsxs("div", {
                            className: "github-widget__meta",
                            children: [
                              jsx(
                                "a",
                                {
                                  className: "github-widget__repo",
                                  href: githubUrl,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  children: githubRepoLabel
                                },
                                "repo"
                              ),
                              jsx("span", {
                                className: "github-widget__branch",
                                children: `${githubBranchLabel} branch${githubLicenseLabel ? ` • ${githubLicenseLabel}` : ""}`
                              })
                            ]
                          }),
                          jsx(
                            "a",
                            {
                              href: githubUrl,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "github-widget__cta",
                              children: "Open Repo"
                            },
                            "cta"
                          )
                        ]
                      }),
                      jsx("p", { className: "github-widget__description", children: githubDescription }),
                      displayGithubStatus === "error"
                        ? jsxs(
                            "div",
                            {
                              className: "github-widget__status github-widget__status--error",
                              children: [
                                jsx("span", {
                                  children: githubError || "Unable to load repository data."
                                }),
                                jsx("button", {
                                  type: "button",
                                  className: "github-widget__retry",
                                  onClick: handleGithubRetry,
                                  children: "Retry"
                                })
                              ]
                            },
                            "github-error"
                          )
                        : displayGithubStatus === "loading"
                        ? jsx(
                            "div",
                            {
                              className: "github-widget__status",
                              children: "Fetching live GitHub stats…"
                            },
                            "github-loading"
                          )
                        : null,
                      displayGithubStatus === "loaded" && githubMetrics.length
                        ? jsx(
                            "div",
                            {
                              className: "github-widget__metrics",
                              children: githubMetrics.map((metric) =>
                                jsxs(
                                  "div",
                                  {
                                    className: "github-widget__metric",
                                    children: [
                                      jsx("span", {
                                        className: "github-widget__metric-value",
                                        children: formatGithubCount(metric.value)
                                      }),
                                      jsx("span", {
                                        className: "github-widget__metric-label",
                                        children: metric.label
                                      })
                                    ]
                                  },
                                  `github-metric-${metric.label}`
                                )
                              )
                            },
                            "github-metrics"
                          )
                        : null,
                      jsxs(
                        "div",
                        {
                          className: "github-widget__footer",
                          children: [
                            jsx("span", {
                              children: githubLanguageLabel || "Polyglot stack"
                            }),
                            githubUpdatedLabel
                              ? jsx(
                                  "span",
                                  {
                                    children: `Updated ${githubUpdatedLabel}`
                                  },
                                  "github-updated"
                                )
                              : null
                          ]
                        },
                        "github-footer"
                      )
                    ]
                  },
                  "github-card"
                )
              : null,
            projectLinks.length
              ? jsx(
                  "div",
                  {
                    className: "project-links",
                    children: projectLinks.map((link, index) =>
                      jsx(
                        "a",
                        {
                          href: link.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "project-link",
                          children: link.label
                        },
                        `link-${index}`
                      )
                    )
                  },
                  "links"
                )
              : null
          ]
        },
        "technical"
      )
    );
  }

  if (galleryMedia.length > 0) {
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-gallery",
          "data-reveal": "",
          children: galleryMedia.map((media, index) => {
            const mediaAlt = media.alt || `${activeProject?.title || "Project"} detail ${index + 1}`;
            const mediaIndex = index + 1;
            return jsxs(
              "figure",
              {
                className: "project-gallery-card",
                style: { transform: `translateY(${parallaxGallery}px)` },
                children: [
                  jsx(
                    "button",
                    {
                      type: "button",
                      className: "project-media-trigger",
                      onClick: () => openLightboxAt(mediaIndex),
                      children:
                        media.kind === "video"
                          ? jsx("video", {
                              className: "project-gallery-asset",
                              src: media.src,
                              muted: true,
                              loop: true,
                              autoPlay: true,
                              playsInline: true
                            })
                          : jsx("img", {
                              className: "project-gallery-asset",
                              src: media.src,
                              alt: mediaAlt,
                              loading: "lazy"
                            })
                    }
                  ),
                  media.caption
                    ? jsx("figcaption", {
                        children: media.caption
                      })
                    : null
                ]
              },
              `gallery-${media.src}-${index}`
            );
          })
        },
        "gallery"
      )
    );
  }

  if (relatedProjects.length > 0) {
    overlaySections.push(
      jsxs(
        "section",
        {
          className: "project-section project-related",
          "data-reveal": "",
          children: [
            jsx("h3", { children: "Related Projects" }),
            jsx("div", {
              className: "project-related-grid",
              children: relatedProjects.map((entry) =>
                jsx(
                  "button",
                  {
                    type: "button",
                    className: "project-related-card",
                    onClick: () => selectProject(entry.index),
                    children: [
                      jsx("img", {
                        src: entry.project.image,
                        alt: entry.project.title,
                        loading: "lazy"
                      }),
                      jsxs("span", {
                        children: [
                          entry.project.title,
                          entry.project.category ? ` · ${entry.project.category}` : ""
                        ]
                      })
                    ]
                  },
                  `related-${entry.index}`
                )
              )
            })
          ]
        },
        "related"
      )
    );
  }

  if (projectPositionLabel) {
    overlaySections.push(
      jsx(
        "section",
        {
          className: "project-section project-position",
          "data-reveal": "",
          children: jsx("span", { children: projectPositionLabel })
        },
        "position"
      )
    );
  }

  return jsxs("div", {
    className: "gallery-root",
    children: [
      jsx("div", { className: "canvas-holder", ref: containerRef }),
      jsxs("div", {
        className: "gallery-overlay",
        children: [
          jsx("div", { className: "gallery-brand", children: "rfml" }),
          jsxs("div", {
            className: "labels-layer",
            ref: labelsLayerRef,
            children: projects.map((project) =>
              jsxs("div", {
                className: "frame-label",
                children: [
                  jsx("strong", { children: project.title }),
                  jsx("span", { children: project.date })
                ]
              }, `label-${project.title}`)
            )
          }),
          jsxs("div", {
            className: "gallery-instructions",
            children: [
              jsx("span", { children: "Hover a frame · click to enter" }),
              jsx("span", { children: "Scroll to zoom" }),
              jsx("span", { children: "Press ESC to return" })
            ]
          })
        ]
      }),
      jsxs("div", {
        className: "project-overlay" + (viewMode === "project" ? " active" : ""),
        ref: projectOverlayRef,
        children: activeProject
          ? [
              jsxs("div", {
                className: "project-chrome",
                children: [
                  jsx("button", {
                    className: "project-close",
                    onClick: closeProject,
                    children: "Return"
                  }, "chrome-close"),
                  jsx("button", {
                    className: "project-nav project-nav-prev",
                    onClick: () => navigateProject(-1),
                    "aria-label": "Previous project",
                    children: "‹"
                  }, "chrome-prev"),
                  jsx("button", {
                    className: "project-nav project-nav-next",
                    onClick: () => navigateProject(1),
                    "aria-label": "Next project",
                    children: "›"
                  }, "chrome-next"),
                  jsx("span", { className: "project-position-indicator", children: projectOrdinal }, "chrome-indicator")
                ]
              }, "chrome"),
              jsx("div", {
                className: "project-scroll" + overlayVariantClass,
                ref: projectScrollRef,
                onTouchStart: handleProjectTouchStart,
                onTouchEnd: handleProjectTouchEnd,
                children: overlaySections
              }, "scroll")
            ]
          : null
      }),
      lightboxOpen && lightboxMedia
        ? jsxs("div", {
            className: "project-lightbox",
            role: "dialog",
            "aria-modal": "true",
            onClick: (event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            },
            children: [
              jsx("button", {
                className: "project-lightbox-close",
                onClick: closeLightbox,
                children: "Close"
              }, "lightbox-close"),
              projectMediaList.length > 1
                ? jsx("button", {
                    className: "project-lightbox-nav prev",
                    onClick: () => stepLightbox(-1),
                    "aria-label": "Previous media",
                    children: "‹"
                  }, "lightbox-prev")
                : null,
                projectMediaList.length > 1
                  ? jsx("button", {
                      className: "project-lightbox-nav next",
                      onClick: () => stepLightbox(1),
                      "aria-label": "Next media",
                      children: "›"
                    }, "lightbox-next")
                  : null,
              jsxs("div", {
                className: "project-lightbox-stage",
                onClick: (event) => event.stopPropagation(),
                children: [
                  lightboxMedia.kind === "video"
                    ? jsx("video", {
                        src: lightboxMedia.src,
                        controls: true,
                        autoPlay: true,
                        loop: true,
                        playsInline: true
                      })
                    : jsx("img", {
                        src: lightboxMedia.src,
                        alt: lightboxMedia.alt || `${activeProject?.title || "Project"} media`
                      })
                ]
              }, "lightbox-stage"),
              lightboxMedia.caption
                ? jsx("div", {
                    className: "project-lightbox-caption",
                    children: lightboxMedia.caption
                  }, "lightbox-caption")
                : null
            ]
          }, "lightbox")
        : null,
      jsx("div", {
        className: "status-indicator",
        children: viewMode === "project" ? "Project View" : "Gallery Navigation"
      }),
      !isSceneReady
        ? jsx("div", {
            className: "status-indicator",
            style: { bottom: "auto", top: "50%", transform: "translate(-50%, -50%)" },
            children: "Calibrating gallery…"
          }, "loading-indicator")
        : null
    ]
  });
}
