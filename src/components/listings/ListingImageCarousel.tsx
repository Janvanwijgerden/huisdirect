"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ListingImageCarouselProps = {
  images: string[];
  title: string;
};

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function ListingImageCarousel({
  images,
  title,
}: ListingImageCarouselProps) {
  const safeImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLabel, setZoomLabel] = useState(1);
  const [zoomCursor, setZoomCursor] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<HTMLDivElement | null>(null);
  const lightboxImgRef = useRef<HTMLImageElement | null>(null);

  const pointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef<Point>({ x: 0, y: 0 });
  const panStartRef = useRef<Point>({ x: 0, y: 0 });

  const rafRef = useRef<number | null>(null);

  const zoomRef = useRef(1);
  const panRef = useRef<Point>({ x: 0, y: 0 });

  const applyTransform = () => {
    const node = transformRef.current;
    if (!node) return;

    node.style.transform = `translate3d(${panRef.current.x}px, ${panRef.current.y}px, 0) scale(${zoomRef.current})`;
    node.style.transformOrigin = "50% 50%";
  };

  const scheduleTransform = () => {
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      applyTransform();
      rafRef.current = null;
    });
  };

  const getCurrentImageRect = (): Rect | null => {
    const img = lightboxImgRef.current;
    if (!img) return null;

    const rect = img.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const getBaseImageSize = (): Size | null => {
    const rect = getCurrentImageRect();
    if (!rect) return null;

    const currentZoom = zoomRef.current || 1;

    return {
      width: rect.width / currentZoom,
      height: rect.height / currentZoom,
    };
  };

  const isPointInsideRect = (x: number, y: number, rect: Rect) => {
    return (
      x >= rect.left &&
      x <= rect.left + rect.width &&
      y >= rect.top &&
      y <= rect.top + rect.height
    );
  };

  const clampPan = (nextPan: Point, nextZoom: number) => {
    const stage = stageRef.current;
    const baseSize = getBaseImageSize();

    if (!stage || !baseSize || nextZoom <= 1) {
      return { x: 0, y: 0 };
    }

    const stageRect = stage.getBoundingClientRect();
    const scaledWidth = baseSize.width * nextZoom;
    const scaledHeight = baseSize.height * nextZoom;

    const maxX = Math.max(0, (scaledWidth - stageRect.width) / 2);
    const maxY = Math.max(0, (scaledHeight - stageRect.height) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
      y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
    };
  };

  const resetZoomState = () => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    pointerIdRef.current = null;

    setZoomLabel(1);
    setZoomCursor(1);
    setIsDragging(false);

    scheduleTransform();
  };

  const goToPrevious = () => {
    setIsLoading(true);
    resetZoomState();
    setCurrentIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsLoading(true);
    resetZoomState();
    setCurrentIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToIndex = (index: number) => {
    setIsLoading(true);
    resetZoomState();
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    resetZoomState();
    setIsOpen(true);
  };

  const closeLightbox = () => {
    resetZoomState();
    setIsOpen(false);
  };

  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const currentImageRect = getCurrentImageRect();
    if (!currentImageRect) return;

    if (!isPointInsideRect(event.clientX, event.clientY, currentImageRect)) {
      return;
    }

    const imageCenterX = currentImageRect.left + currentImageRect.width / 2;
    const imageCenterY = currentImageRect.top + currentImageRect.height / 2;

    const cursorX = event.clientX - imageCenterX;
    const cursorY = event.clientY - imageCenterY;

    const prevZoom = zoomRef.current;
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    const nextZoom = Math.max(1, Math.min(8, prevZoom * factor));

    if (nextZoom === prevZoom) return;

    const zoomRatio = nextZoom / prevZoom;

    let nextPan = {
      x: panRef.current.x - cursorX * (zoomRatio - 1),
      y: panRef.current.y - cursorY * (zoomRatio - 1),
    };

    if (nextZoom < prevZoom) {
      const thresholdStart = 1.35;
      const thresholdEnd = 1.0;

      if (nextZoom < thresholdStart) {
        const t =
          (thresholdStart - nextZoom) / (thresholdStart - thresholdEnd);
        const ease = t * t;

        nextPan = {
          x: nextPan.x * (1 - ease),
          y: nextPan.y * (1 - ease),
        };
      }
    }

    zoomRef.current = nextZoom;

    if (nextZoom === 1) {
      panRef.current = { x: 0, y: 0 };
    } else {
      panRef.current = clampPan(nextPan, nextZoom);
    }

    setZoomLabel(nextZoom);
    setZoomCursor(nextZoom);
    scheduleTransform();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoomRef.current <= 1) return;

    const currentImageRect = getCurrentImageRect();
    if (!currentImageRect) return;

    if (!isPointInsideRect(event.clientX, event.clientY, currentImageRect)) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    panStartRef.current = { ...panRef.current };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (pointerIdRef.current !== event.pointerId) return;
    if (zoomRef.current <= 1) return;

    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;

    const nextPan = {
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
    };

    panRef.current = clampPan(nextPan, zoomRef.current);
    scheduleTransform();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === event.pointerId) {
      pointerIdRef.current = null;
    }

    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDoubleClick = () => {
    resetZoomState();
  };

  useEffect(() => {
    applyTransform();
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl bg-stone-100 shadow-sm">
          <div
            className="relative aspect-[16/9] w-full cursor-pointer"
            onClick={openLightbox}
          >
            <Image
              src={safeImages[currentIndex]}
              alt={`${title} - foto ${currentIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className={`object-cover object-center md:object-[center_40%] transition duration-300 pointer-events-none ${
                isLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
              }`}
              onLoad={() => setIsLoading(false)}
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToPrevious();
              }}
              aria-label="Vorige foto"
              className="absolute left-0 top-0 z-10 h-full w-1/4 cursor-pointer bg-transparent"
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToNext();
              }}
              aria-label="Volgende foto"
              className="absolute right-0 top-0 z-10 h-full w-1/4 cursor-pointer bg-transparent"
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToPrevious();
              }}
              aria-label="Vorige foto knop"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-stone-800" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToNext();
              }}
              aria-label="Volgende foto knop"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-stone-800" />
            </button>

            <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/65 px-3 py-1 text-sm font-medium text-white">
              {currentIndex + 1} / {safeImages.length}
            </div>
          </div>
        </div>

        {safeImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {safeImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => goToIndex(index)}
                className={`relative overflow-hidden rounded-2xl ring-2 transition ${
                  currentIndex === index
                    ? "ring-emerald-600"
                    : "ring-transparent hover:ring-stone-300"
                }`}
              >
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95">
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Sluiten"
            className="absolute right-4 top-4 z-[120] rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Vorige foto"
            className="absolute left-4 top-1/2 z-[120] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Volgende foto"
            className="absolute right-4 top-1/2 z-[120] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            {currentIndex + 1} / {safeImages.length}
          </div>

          <div className="absolute bottom-4 right-4 z-[120] rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            {zoomLabel.toFixed(1)}x
          </div>

          <div
            ref={stageRef}
            className={`flex h-full w-full items-center justify-center overflow-hidden p-6 md:p-10 ${
              zoomCursor > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-pointer"
            }`}
            onWheel={handleWheelZoom}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
          >
            <div
              ref={transformRef}
              className="flex h-full w-full items-center justify-center will-change-transform"
              style={{
                transform: "translate3d(0px, 0px, 0) scale(1)",
                transformOrigin: "50% 50%",
              }}
            >
              <img
                ref={lightboxImgRef}
                src={safeImages[currentIndex]}
                alt={`${title} fullscreen ${currentIndex + 1}`}
                draggable={false}
                className="pointer-events-none max-h-full max-w-full select-none object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}