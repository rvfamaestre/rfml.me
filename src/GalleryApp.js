import { useEffect, useRef, useState } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm";
import { jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@18.2.0/jsx-runtime/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { easeStandard, easeDramatic } from "./utils/easings.js";

export default function GalleryApp({ projects = [] }) {
  const containerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewMode, setViewMode] = useState("gallery");
  const [isSceneReady, setSceneReady] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);

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
      lastPointer: { x: 0, y: 0 }
    },
    keyboard: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false
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
    orientationFlip: null,
    pointerLocked: false,
    pointerLockSuppressClick: false,
    pointerLockReleaseReason: null,
    supportsPointerLock: true
  });

  useEffect(() => {
    runtimeRef.current.viewState = viewMode;
  }, [viewMode]);

  useEffect(() => {
    runtimeRef.current.active = activeIndex;
  }, [activeIndex]);

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
    runtime.supportsPointerLock = typeof renderer.domElement.requestPointerLock === "function";
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

    const exitFullscreen = () => {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (document.fullscreenElement && exit) {
        try {
          const result = exit.call(document);
          if (result && typeof result.catch === "function") {
            result.catch(() => {});
          }
        } catch (err) {
          /* noop */
        }
      }
    };

    const requestImmersiveMode = () => {
      runtime.pointerLockReleaseReason = null;
      if (runtime.supportsPointerLock && renderer.domElement.requestPointerLock) {
        if (document.pointerLockElement !== renderer.domElement) {
          renderer.domElement.requestPointerLock();
          runtime.pointerLockSuppressClick = true;
        }
      } else {
        runtime.pointerLocked = false;
        runtime.pointerLockSuppressClick = false;
      }
      if (!document.fullscreenElement && container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      startAmbience();
      if (runtime.viewState !== "gallery") return;
      if (runtime.supportsPointerLock) {
        if (!runtime.pointerLocked) {
          requestImmersiveMode();
        }
      } else {
        runtime.controls.dragging = true;
        runtime.controls.lastPointer.x = event.clientX;
        runtime.controls.lastPointer.y = event.clientY;
        const rect = renderer.domElement.getBoundingClientRect();
        runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        renderer.domElement.style.cursor = "grabbing";
        if (renderer.domElement.setPointerCapture) {
          try {
            renderer.domElement.setPointerCapture(event.pointerId);
          } catch (err) {
            /* noop */
          }
        }
      }
    };

    const onPointerUp = (event) => {
      if (event.button !== 0) return;
      if (!runtime.supportsPointerLock) {
        runtime.controls.dragging = false;
        if (runtime.viewState === "gallery") {
          renderer.domElement.style.cursor = "crosshair";
        }
        if (renderer.domElement.releasePointerCapture) {
          try {
            renderer.domElement.releasePointerCapture(event.pointerId);
          } catch (err) {
            /* noop */
          }
        }
      }
      if (runtime.pointerLocked) return;
      const rect = renderer.domElement.getBoundingClientRect();
      runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (event) => {
      if (runtime.pointerLocked && runtime.viewState === "gallery") {
        const sensitivity = 0.0018;
        runtime.controls.targetYaw -= event.movementX * sensitivity;
        runtime.controls.targetPitch = THREE.MathUtils.clamp(
          runtime.controls.targetPitch - event.movementY * sensitivity,
          -0.75,
          0.6
        );
        runtime.pointer.set(0, 0);
      } else {
        const rect = renderer.domElement.getBoundingClientRect();
        runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        if (!runtime.supportsPointerLock && runtime.controls.dragging && runtime.viewState === "gallery") {
          const dx = event.clientX - runtime.controls.lastPointer.x;
          const dy = event.clientY - runtime.controls.lastPointer.y;
          runtime.controls.targetYaw -= dx * 0.0022;
          runtime.controls.targetPitch = THREE.MathUtils.clamp(
            runtime.controls.targetPitch - dy * 0.0016,
            -0.65,
            0.45
          );
          runtime.controls.lastPointer.x = event.clientX;
          runtime.controls.lastPointer.y = event.clientY;
        }
      }
    };

    const onClick = (event) => {
      if (runtime.pointerLockSuppressClick) {
        runtime.pointerLockSuppressClick = false;
        return;
      }
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

    const keyMap = {
      KeyW: "forward",
      KeyS: "backward",
      KeyA: "left",
      KeyD: "right",
      KeyQ: "down",
      KeyE: "up",
      Space: "up",
      ShiftLeft: "down",
      ShiftRight: "down"
    };

    const onKeyDown = (event) => {
      if (event.code === "Escape" && runtime.viewState === "project") {
        closeProject();
        return;
      }
      if (event.code === "Escape" && runtime.pointerLocked) {
        runtime.pointerLockReleaseReason = "escape";
        document.exitPointerLock();
        exitFullscreen();
        return;
      }
      if (runtime.viewState === "project") {
        if (event.code === "ArrowRight") {
          navigateProject(1);
        } else if (event.code === "ArrowLeft") {
          navigateProject(-1);
        }
      }
      const key = keyMap[event.code];
      if (key) {
        runtime.keyboard[key] = true;
        if (["forward", "backward", "left", "right"].includes(key)) {
          event.preventDefault();
        }
      }
    };

    const onKeyUp = (event) => {
      const key = keyMap[event.code];
      if (key) {
        runtime.keyboard[key] = false;
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
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      runtime.pointerLocked = locked;
      const releaseReason = runtime.pointerLockReleaseReason;
      runtime.pointerLockReleaseReason = null;
      setPointerLocked(locked);
      if (locked) {
        runtime.pointer.set(0, 0);
        renderer.domElement.style.cursor = "none";
      } else {
        runtime.pointerLockSuppressClick = false;
        renderer.domElement.style.cursor = releaseReason === "project"
          ? "default"
          : (runtime.viewState === "gallery" ? "crosshair" : "default");
        runtime.pointer.set(0, 0);
        if (releaseReason !== "project") {
          exitFullscreen();
        }
      }
    };

    const onPointerLockError = () => {
      runtime.pointerLocked = false;
      runtime.pointerLockReleaseReason = null;
      runtime.pointerLockSuppressClick = false;
      setPointerLocked(false);
      renderer.domElement.style.cursor = runtime.viewState === "gallery" ? "crosshair" : "default";
      exitFullscreen();
    };

    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);

    const openFrame = (frameItem) => {
      if (runtime.transition) return;
      if (document.pointerLockElement === renderer.domElement) {
        runtime.pointerLockReleaseReason = "project";
        document.exitPointerLock();
      }
      runtime.controls.dragging = false;
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

      const moveVector = new THREE.Vector3(
        (runtime.keyboard.right ? 1 : 0) - (runtime.keyboard.left ? 1 : 0),
        (runtime.keyboard.up ? 1 : 0) - (runtime.keyboard.down ? 1 : 0),
        (runtime.keyboard.backward ? 1 : 0) - (runtime.keyboard.forward ? 1 : 0)
      );

      if (runtime.viewState === "gallery") {
        const directionVector = new THREE.Vector3(
          Math.sin(runtime.controls.yaw),
          Math.tan(runtime.controls.pitch),
          Math.cos(runtime.controls.yaw)
        ).normalize();
        const sideways = new THREE.Vector3().crossVectors(directionVector, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3(0, 1, 0);

        const moveSpeed = 4.6;
        if (moveVector.lengthSq() > 0) {
          camera.position.addScaledVector(directionVector, -moveVector.z * moveSpeed * delta);
          camera.position.addScaledVector(sideways, moveVector.x * moveSpeed * delta);
          camera.position.addScaledVector(up, moveVector.y * moveSpeed * delta);
        }

        camera.position.y = THREE.MathUtils.clamp(camera.position.y, -1, 8);

        const lookTarget = new THREE.Vector3(
          camera.position.x + Math.sin(runtime.controls.yaw) * Math.cos(runtime.controls.pitch),
          camera.position.y + Math.sin(runtime.controls.pitch),
          camera.position.z + Math.cos(runtime.controls.yaw) * Math.cos(runtime.controls.pitch)
        );
        camera.lookAt(lookTarget);
      }

      runtime.hovered = null;
      if (runtime.pointerLocked) {
        runtime.pointer.set(0, 0);
      }
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
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("pointerlockerror", onPointerLockError);

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
    if (pointerLocked) {
      dom.style.cursor = "none";
    } else {
      dom.style.cursor = viewMode === "gallery" ? "crosshair" : "default";
    }
  }, [viewMode, pointerLocked]);

  const closeProject = () => {
    runtimeRef.current.internalClose?.();
  };

  const navigateProject = (direction) => {
    runtimeRef.current.internalNavigate?.(direction);
  };

  return jsxs("div", {
    className: "gallery-root",
    children: [
      jsx("div", { className: "canvas-holder", ref: containerRef }),
      jsx("div", { className: pointerLocked ? "crosshair active" : "crosshair", "aria-hidden": "true" }),
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
              jsx("span", { children: "Click to enter immersive mode" }),
              jsx("span", { children: "Center a frame · click to dive in" }),
              jsx("span", { children: "Move mouse to look · WASD / Space / Q / E to drift" }),
              jsx("span", { children: "Scroll to glide" }),
              jsx("span", { children: "Press ESC to release" })
            ]
          })
        ]
      }),
      jsxs("div", {
        className: "project-overlay" + (viewMode === "project" ? " active" : ""),
        children: typeof activeIndex === "number"
          ? [
              jsx("button", {
                className: "project-close",
                onClick: closeProject,
                children: "Return"
              }, "close"),
              jsxs("div", {
                className: "project-media",
                children: [
                  jsxs("div", {
                    className: "project-controls",
                    children: [
                      jsx("button", {
                        className: "project-arrow left",
                        onClick: () => navigateProject(-1),
                        children: "Prev"
                      }, "prev"),
                      jsx("button", {
                        className: "project-arrow right",
                        onClick: () => navigateProject(1),
                        children: "Next"
                      }, "next")
                    ]
                  }),
                  jsx("img", {
                    src: projects[activeIndex].image,
                    alt: projects[activeIndex].title,
                    loading: "lazy"
                  })
                ]
              }, "media"),
              jsxs("div", {
                className: "project-meta",
                children: [
                  jsx("h2", { children: projects[activeIndex].title }),
                  jsx("span", {
                    children: projects[activeIndex].date +
                      (projects[activeIndex].category ? ` — ${projects[activeIndex].category}` : "")
                  })
                ]
              }, "meta")
            ]
          : null
      }),
      jsx("div", {
        className: "status-indicator",
        children: viewMode === "project" ? "Project View" : (pointerLocked ? "Immersive Navigation" : "Gallery Navigation")
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
