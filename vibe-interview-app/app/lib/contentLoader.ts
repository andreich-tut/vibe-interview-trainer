/**
 * contentLoader.ts
 *
 * Async loader for JSON content files located in the `content/` public directory.
 * Supports topics, cards, theory, and event-loop content types.
 * All loaded content is cached in memory to prevent redundant network requests.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
}

export interface TopicsFile {
  topics: Topic[];
}

// ---------------------------------------------------------------------------

export interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
  keyPoints?: string[];
}

export interface CardsFile {
  cards: Card[];
}

// ---------------------------------------------------------------------------

export interface TheoryItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface TheoryFile {
  theory: TheoryItem[];
}

// ---------------------------------------------------------------------------

export interface EventLoopStep {
  tag: "sync" | "micro" | "macro";
  label: string;
  desc: string;
}

export interface EventLoopQuestion {
  code: string;
  answer: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
  steps: EventLoopStep[];
  explanation: string;
}

export interface EventLoopFile {
  easy: EventLoopQuestion[];
  medium: EventLoopQuestion[];
  hard: EventLoopQuestion[];
}

// ---------------------------------------------------------------------------
// Overloaded return types for loadContent
// ---------------------------------------------------------------------------

export type ContentType = "topics" | "cards" | "theory" | "event-loop";

export interface ContentTypeMap {
  topics: TopicsFile;
  cards: CardsFile;
  theory: TheoryFile;
  "event-loop": EventLoopFile;
}

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

const cache = new Map<string, unknown>();

function buildCacheKey(language: string, type: ContentType, topic?: string): string {
  return topic ? `${language}/${type}/${topic}` : `${language}/${type}`;
}

function buildUrl(language: string, type: ContentType, topic?: string): string {
  if (type === "topics") {
    return `/content/${language}/topics.json`;
  }
  if (type === "event-loop") {
    return `/content/${language}/event-loop.json`;
  }
  if (!topic) {
    throw new Error(
      `[contentLoader] loadContent('${language}', '${type}') requires a topic argument.`
    );
  }
  return `/content/${language}/${type}/${topic}.json`;
}

// ---------------------------------------------------------------------------
// Core loader
// ---------------------------------------------------------------------------

/**
 * Loads JSON content from the public `/content/` directory.
 *
 * @param language - Language code, e.g. 'ru'
 * @param type     - Content type: 'topics' | 'cards' | 'theory' | 'event-loop'
 * @param topic    - Topic slug (required for 'cards' and 'theory'), e.g. 'javascript'
 * @returns        - Typed content object from the matching JSON file
 *
 * @example
 *   const { topics } = await loadContent('ru', 'topics');
 *   const { cards }  = await loadContent('ru', 'cards', 'javascript');
 *   const { theory } = await loadContent('ru', 'theory', 'react');
 *   const eventLoop  = await loadContent('ru', 'event-loop');
 */
export async function loadContent<T extends ContentType>(
  language: string,
  type: T,
  topic?: string
): Promise<ContentTypeMap[T]> {
  const cacheKey = buildCacheKey(language, type, topic);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as ContentTypeMap[T];
  }

  const url = buildUrl(language, type, topic);

  let response: Response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    const msg = `[contentLoader] Network error while fetching "${url}": ${String(networkError)}`;
    console.error(msg);
    throw new Error(msg);
  }

  if (!response.ok) {
    const msg = `[contentLoader] Failed to load "${url}" — HTTP ${response.status} ${response.statusText}`;
    console.error(msg);
    throw new Error(msg);
  }

  let data: ContentTypeMap[T];
  try {
    data = (await response.json()) as ContentTypeMap[T];
  } catch (parseError) {
    const msg = `[contentLoader] JSON parse error for "${url}": ${String(parseError)}`;
    console.error(msg);
    throw new Error(msg);
  }

  cache.set(cacheKey, data);
  return data;
}
