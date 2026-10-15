"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();
const subscribeCache = new Map<string, (cb: () => void) => () => void>();
const flagSnapshotCache = new Map<string, () => string | null>();
const jsonSnapshotCache = new Map<string, () => unknown>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribeKey(key: string, listener: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  const bucket = set;
  bucket.add(listener);
  return () => {
    bucket.delete(listener);
  };
}

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable or full */
  }
  emit(key);
}

function subscribeTo(key: string) {
  let fn = subscribeCache.get(key);
  if (!fn) {
    fn = (cb: () => void) => subscribeKey(key, cb);
    subscribeCache.set(key, fn);
  }
  return fn;
}

const jsonCache = new Map<string, { raw: string | null; parsed: unknown }>();

function getJsonSnapshot(key: string): unknown {
  const raw = read(key);
  const cached = jsonCache.get(key);
  if (cached && cached.raw === raw) return cached.parsed;
  let parsed: unknown = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }
  jsonCache.set(key, { raw, parsed });
  return parsed;
}

function jsonSnapshot(key: string) {
  let fn = jsonSnapshotCache.get(key);
  if (!fn) {
    fn = () => getJsonSnapshot(key);
    jsonSnapshotCache.set(key, fn);
  }
  return fn;
}

function flagSnapshot(key: string) {
  let fn = flagSnapshotCache.get(key);
  if (!fn) {
    fn = () => read(key);
    flagSnapshotCache.set(key, fn);
  }
  return fn;
}

const serverNull = () => null;

export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function useLocalStorageFlag(
  key: string,
  fallback: boolean
): [boolean, (value: boolean) => void] {
  const raw = useSyncExternalStore(subscribeTo(key), flagSnapshot(key), serverNull);
  const set = useCallback((value: boolean) => write(key, value ? "1" : "0"), [key]);
  return [raw === null ? fallback : raw === "1", set];
}

export function useLocalStorageJson<T>(
  key: string,
  fallback: T
): [T, (value: T) => void] {
  const parsed = useSyncExternalStore(
    subscribeTo(key),
    jsonSnapshot(key),
    serverNull
  ) as T | null;
  const set = useCallback(
    (value: T) => write(key, JSON.stringify(value)),
    [key]
  );
  return [parsed ?? fallback, set];
}
