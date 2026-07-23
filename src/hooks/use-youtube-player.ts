import { useCallback, useEffect, useRef, useState } from "react";

const API_SRC = "https://www.youtube.com/iframe_api";

let apiPromise: Promise<void> | null = null;

/**
 * Loads the YouTube IFrame API exactly once per page, no matter how many
 * players mount. Resolves as soon as `window.YT.Player` is constructible.
 */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${API_SRC}"]`
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("YouTube API failed to load"));
    document.head.appendChild(script);
  });

  return apiPromise;
}

interface UseYouTubePlayerResult {
  /** attach to the element the player should replace */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** true once the player can accept commands */
  ready: boolean;
  /** mirrors the real player state, so the icon never lies */
  playing: boolean;
  /** the API or the video failed — callers should degrade gracefully */
  failed: boolean;
  /** starts the player, mounting it on first use */
  play: () => void;
  /** play when paused, pause when playing */
  toggle: () => void;
}

/**
 * Wraps a single YouTube player.
 *
 * The player is created lazily on the first `play()` so the page never pays
 * for an embed the visitor didn't ask for. Playback state comes from the
 * API's own `onStateChange`, which means a custom button can both control
 * the video and reflect what it is actually doing — including when the
 * viewer uses YouTube's native controls instead.
 */
export function useYouTubePlayer(videoId: string): UseYouTubePlayerResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const createPlayer = useCallback(async () => {
    if (playerRef.current || !containerRef.current) return;

    try {
      await loadYouTubeApi();
    } catch {
      if (mountedRef.current) setFailed(true);
      return;
    }

    if (!mountedRef.current || !containerRef.current || !window.YT?.Player) {
      if (mountedRef.current) setFailed(true);
      return;
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        rel: 0,
        controls: 1,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          if (!mountedRef.current) return;
          setReady(true);
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (!mountedRef.current || !window.YT) return;
          setPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
        onError: () => {
          if (mountedRef.current) setFailed(true);
        },
      },
    });
  }, [videoId]);

  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }
    void createPlayer();
  }, [createPlayer]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      void createPlayer();
      return;
    }
    if (playing) player.pauseVideo();
    else player.playVideo();
  }, [createPlayer, playing]);

  return { containerRef, ready, playing, failed, play, toggle };
}
