import timelineRaw from "$content/timeline.yaml";

interface TimelineItem {
  title: string;
}

export type Timeline = Record<string, TimelineItem>;

export const timeline = timelineRaw as Timeline;
