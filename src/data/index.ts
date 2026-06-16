import { comercialContent } from './comercial';
import { logisticaContent } from './logistica';
import type { ContentItem, Area, Topic, PracticeMode } from './types';

export const allContent: ContentItem[] = [...comercialContent, ...logisticaContent];

export function getByArea(area: Area): ContentItem[] {
  return allContent.filter((item) => item.area === area);
}

export function getByTopic(topic: Topic): ContentItem[] {
  return allContent.filter((item) => item.topic === topic);
}

export function getByMode(mode: Exclude<PracticeMode, 'mixto'>): ContentItem[] {
  return allContent.filter((item) => item.type === mode);
}

export function getByAreaAndTopic(area: Area, topic: Topic): ContentItem[] {
  return allContent.filter((item) => item.area === area && item.topic === topic);
}

export function getSessionItems(
  area: Area | 'all',
  topic: Topic | 'all',
  mode: PracticeMode,
  limit = 10,
): ContentItem[] {
  let pool = allContent;

  if (area !== 'all') pool = pool.filter((i) => i.area === area);
  if (topic !== 'all') pool = pool.filter((i) => i.topic === topic);

  if (mode !== 'mixto') {
    pool = pool.filter((i) => i.type === mode);
  }

  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

export * from './types';
export * from './topics';
