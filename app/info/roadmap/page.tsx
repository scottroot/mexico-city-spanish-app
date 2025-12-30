import Script from 'next/script';

export default function RoadmapPage() {
  return (
    <div>
      <Script src="https://p.trellocdn.com/embed.min.js" />
      <blockquote className="trello-board-compact">
        <a href="https://trello.com/b/G8KE638v/capital-spanish">Trello Board</a>
      </blockquote>


      <blockquote className="trello-card">
        <a href="https://trello.com/c/59jDO90r/1-pronunciation-audio-feature">Trello Card</a>
      </blockquote>
      <Script src="https://p.trellocdn.com/embed.min.js" />

    </div>
  );
}